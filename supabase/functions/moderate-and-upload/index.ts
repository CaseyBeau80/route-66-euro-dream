
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  console.log('🚀 Edge Function called:', req.method, req.url);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const visionApiKey = Deno.env.get('GCP_VISION_API_KEY');

  console.log('🔧 Environment check:', {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseKey,
    hasVisionKey: !!visionApiKey
  });

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase credentials');
    return new Response(JSON.stringify({
      success: false,
      error: 'Server configuration error: Missing Supabase credentials'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (!visionApiKey) {
    console.log('❌ Missing Vision API key');
    return new Response(JSON.stringify({
      success: false,
      error: 'Server configuration error: Missing Vision API key'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('📝 Processing form data...');
    const formData = await req.formData();
    
    const imageFile = formData.get('image') as File;
    const tripId = formData.get('tripId') as string;
    const stopId = formData.get('stopId') as string;
    const userSessionId = formData.get('userSessionId') as string;

    console.log('📋 Form data received:', {
      hasImageFile: !!imageFile,
      imageFileName: imageFile?.name,
      imageFileSize: imageFile?.size,
      tripId,
      stopId,
      userSessionId
    });

    if (!imageFile || !tripId || !stopId || !userSessionId) {
      console.log('❌ Missing required fields');
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields: image, tripId, stopId, or userSessionId'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Convert image to base64
    console.log('🔄 Converting image to base64...');
    const imageBuffer = await imageFile.arrayBuffer();
    const uint8Array = new Uint8Array(imageBuffer);
    
    let base64Image = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      base64Image += btoa(String.fromCharCode.apply(null, Array.from(chunk)));
    }

    console.log('✅ Image converted to base64, length:', base64Image.length);

    // Call Google Vision API for moderation
    console.log('🔍 Calling Vision API for moderation...');
    const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image
          },
          features: [{
            type: 'SAFE_SEARCH_DETECTION',
            maxResults: 1
          }]
        }]
      })
    });

    console.log('📊 Vision API response status:', visionResponse.status, visionResponse.statusText);

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.log('❌ Vision API error response:', errorText);
      throw new Error(`Vision API error: ${visionResponse.status} ${visionResponse.statusText} - ${errorText}`);
    }

    const visionData = await visionResponse.json();
    console.log('📄 Vision API response:', JSON.stringify(visionData, null, 2));

    const safeSearch = visionData.responses?.[0]?.safeSearchAnnotation;

    if (!safeSearch) {
      console.log('❌ No SafeSearch results from Vision API');
      throw new Error('No moderation results from Vision API');
    }

    console.log('🛡️ SafeSearch results:', safeSearch);

    // Check if image is safe
    const safeValues = ['VERY_UNLIKELY', 'UNLIKELY'];
    const isSafe = ['adult', 'violence', 'racy', 'spoof', 'medical']
      .every(category => safeValues.includes(safeSearch[category]));

    console.log('✅ Image safety check:', { isSafe, safeSearch });

    if (!isSafe) {
      console.log('🚫 Image rejected by moderation filter');
      return new Response(JSON.stringify({
        success: true,
        allowed: false,
        message: 'Image rejected by moderation filter',
        moderationResults: safeSearch
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const fileExt = imageFile.name?.split('.').pop() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `challenges/${fileName}`;

    console.log('📁 Uploading to storage:', filePath);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('photo-challenges')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.log('❌ Storage upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    console.log('✅ File uploaded to storage successfully');

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('photo-challenges')
      .getPublicUrl(filePath);

    console.log('🔗 Public URL generated:', publicUrl);

    // Check if this location already has a trailblazer
    const { data: existingTrailblazer } = await supabase
      .from('trailblazer_achievements')
      .select('*')
      .eq('stop_id', stopId)
      .limit(1);

    const isTrailblazer = !existingTrailblazer || existingTrailblazer.length === 0;
    console.log('🏆 Trailblazer status:', { isTrailblazer, existingCount: existingTrailblazer?.length || 0 });

    // Insert into photo_challenges table
    const { data: challengeData, error: dbError } = await supabase
      .from('photo_challenges')
      .insert({
        photo_url: publicUrl,
        stop_id: stopId,
        trip_id: tripId,
        user_session_id: userSessionId,
        moderation_result: safeSearch,
        is_trailblazer: isTrailblazer
      })
      .select()
      .single();

    if (dbError) {
      console.log('❌ Database insert error:', dbError);
      // Clean up uploaded file on database error
      await supabase.storage.from('photo-challenges').remove([filePath]);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('✅ Photo challenge record created:', challengeData.id);

    // If this is a trailblazer, create achievement record
    if (isTrailblazer) {
      const { error: achievementError } = await supabase
        .from('trailblazer_achievements')
        .insert({
          stop_id: stopId,
          photo_challenge_id: challengeData.id,
          user_session_id: userSessionId
        });

      if (achievementError) {
        console.log('⚠️ Trailblazer achievement creation failed:', achievementError);
        // Don't fail the entire request for this
      } else {
        console.log('🏆 Trailblazer achievement created!');
      }
    }

    const response = {
      success: true,
      allowed: true,
      message: isTrailblazer ? 'Congratulations! You are now a Trailblazer for this location!' : 'Photo uploaded successfully',
      photoUrl: publicUrl,
      isTrailblazer,
      moderationResults: safeSearch,
      challengeId: challengeData.id,
      stopId
    };

    console.log('🎉 Success response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('💥 Edge function error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unexpected server error',
      details: error.stack || 'No stack trace available'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
