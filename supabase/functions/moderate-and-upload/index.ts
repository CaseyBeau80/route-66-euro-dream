
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Add timeout to prevent hanging
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout after 25 seconds')), 25000);
  });

  try {
    const processRequest = async () => {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const visionApiKey = Deno.env.get('GCP_VISION_API_KEY')!;

      const supabase = createClient(supabaseUrl, supabaseKey);

      console.log('📤 Processing upload request...');

      // Parse the multipart form data
      const formData = await req.formData();
      const imageFile = formData.get('image') as File;
      const tripId = formData.get('tripId') as string;
      const stopId = formData.get('stopId') as string;
      const userSessionId = formData.get('userSessionId') as string;

      if (!imageFile) {
        throw new Error('No image file provided');
      }

      if (!visionApiKey) {
        throw new Error('Vision API key not configured');
      }

      console.log('📋 Request details:', {
        fileName: imageFile.name,
        fileSize: imageFile.size,
        fileType: imageFile.type,
        tripId,
        stopId,
        userSessionId
      });

      // Check if this location already has a trailblazer
      console.log('🔍 Checking existing trailblazer status for:', stopId);
      let existingTrailblazer = null;
      let isLocationUnclaimed = true;
      
      try {
        const { data: trailblazerData, error: trailblazerError } = await supabase
          .rpc('get_location_trailblazer', { location_stop_id: stopId });
        
        if (trailblazerError) {
          console.warn('⚠️ Trailblazer check failed:', trailblazerError);
        } else {
          existingTrailblazer = trailblazerData;
          isLocationUnclaimed = !trailblazerData?.[0]?.has_trailblazer;
        }
      } catch (error) {
        console.warn('⚠️ Trailblazer check exception:', error);
        // Continue with upload even if trailblazer check fails
      }
      
      console.log('🎯 Location unclaimed status:', isLocationUnclaimed);

      // Convert image to base64 for Vision API
      const imageBytes = await imageFile.arrayBuffer();
      const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBytes)));

      console.log('🔍 Sending image to Google Vision API for moderation...');

      // Call Google Vision API for content moderation
      const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64Image },
              features: [{ type: 'SAFE_SEARCH_DETECTION', maxResults: 1 }]
            }
          ]
        })
      });

      if (!visionResponse.ok) {
        console.error('❌ Vision API error:', visionResponse.status, visionResponse.statusText);
        throw new Error(`Vision API error: ${visionResponse.status}`);
      }

      const visionData = await visionResponse.json();
      console.log('✅ Vision API response received');

      if (visionData.responses[0]?.error) {
        throw new Error(`Vision API error: ${visionData.responses[0].error.message}`);
      }

      const safeSearch = visionData.responses[0]?.safeSearchAnnotation;
      if (!safeSearch) {
        throw new Error('No SafeSearch results from Vision API');
      }

      console.log('🛡️ Moderation results:', safeSearch);

      // Check if image is safe
      const safeLevels = ['VERY_UNLIKELY', 'UNLIKELY'];
      const isImageSafe = safeLevels.includes(safeSearch.adult) &&
                        safeLevels.includes(safeSearch.violence) &&
                        safeLevels.includes(safeSearch.racy) &&
                        safeLevels.includes(safeSearch.spoof) &&
                        safeLevels.includes(safeSearch.medical);

      console.log('✅ Image safety check:', isImageSafe ? 'PASSED' : 'FAILED');

      if (!isImageSafe) {
        return {
          success: true,
          allowed: false,
          error: 'Image did not pass content moderation',
          moderationResults: safeSearch
        };
      }

      // Generate unique filename and upload to storage
      const fileExtension = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `challenges/${fileName}`;

      console.log('📤 Uploading to Supabase storage:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photo-challenges')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photo-challenges')
        .getPublicUrl(filePath);

      console.log('✅ File uploaded successfully:', publicUrl);

      // Insert photo challenge record
      console.log('💾 Inserting photo challenge record...');
      const { data: challengeData, error: challengeError } = await supabase
        .from('photo_challenges')
        .insert({
          photo_url: publicUrl,
          stop_id: stopId,
          trip_id: tripId,
          user_session_id: userSessionId,
          moderation_result: safeSearch
        })
        .select()
        .single();

      if (challengeError) {
        console.error('❌ Database insert error:', challengeError);
        // Clean up uploaded file
        await supabase.storage.from('photo-challenges').remove([filePath]);
        throw new Error(`Database error: ${challengeError.message}`);
      }

      console.log('✅ Photo challenge record created:', challengeData.id);

      // The trailblazer logic is handled by the database trigger
      // Check if this record was marked as trailblazer
      const isTrailblazer = challengeData.is_trailblazer || false;
      
      if (isTrailblazer) {
        console.log('🏆 TRAILBLAZER ACHIEVED! First photo at location:', stopId);
      }

      return {
        success: true,
        allowed: true,
        photoUrl: publicUrl,
        moderationResults: safeSearch,
        isTrailblazer: isTrailblazer,
        challengeId: challengeData.id,
        stopId: stopId,
        message: isTrailblazer ? 'Congratulations! You are the first Trailblazer at this location!' : 'Photo uploaded successfully!'
      };
    };

    // Race between the actual request and timeout
    const result = await Promise.race([processRequest(), timeoutPromise]);
    
    console.log('🎉 Upload process completed successfully');
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
