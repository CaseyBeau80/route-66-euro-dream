import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const visionApiKey = Deno.env.get('GCP_VISION_API_KEY');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');
    const tripId = formData.get('tripId');
    const stopId = formData.get('stopId');
    const userSessionId = formData.get('userSessionId');

    if (!imageFile || !tripId || !stopId || !userSessionId) {
      throw new Error('Missing one or more required fields');
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const uint8Array = new Uint8Array(imageBuffer);

    let base64Image = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      base64Image += btoa(String.fromCharCode.apply(null, Array.from(chunk)));
    }

    const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [{ type: 'SAFE_SEARCH_DETECTION', maxResults: 1 }]
        }]
      })
    });

    const visionData = await visionResponse.json();
    const safeSearch = visionData.responses?.[0]?.safeSearchAnnotation;

    if (!safeSearch) {
      throw new Error('No moderation results from Vision API');
    }

    const safe = ['VERY_UNLIKELY', 'UNLIKELY'];
    const isSafe = ['adult', 'violence', 'racy', 'spoof', 'medical']
      .every(type => safe.includes(safeSearch?.[type]));

    if (!isSafe) {
      return new Response(JSON.stringify({
        success: true,
        allowed: false,
        message: 'Image rejected by moderation filter',
        moderationResults: safeSearch
      }), { headers: corsHeaders });
    }

    const fileExt = imageFile.name?.split('.').pop() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `challenges/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('photo-challenges')
      .upload(filePath, imageFile, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('photo-challenges').getPublicUrl(filePath);

    const { data, error: dbError } = await supabase.from('photo_challenges').insert({
      photo_url: publicUrl,
      stop_id: stopId,
      trip_id: tripId,
      user_session_id: userSessionId,
      moderation_result: safeSearch
    }).select().single();

    if (dbError) {
      await supabase.storage.from('photo-challenges').remove([filePath]);
      throw dbError;
    }

    return new Response(JSON.stringify({
      success: true,
      allowed: true,
      message: 'Photo uploaded',
      photoUrl: publicUrl,
      moderationResults: safeSearch,
      challengeId: data.id,
      stopId
    }), { headers: corsHeaders });

  } catch (e) {
    return new Response(JSON.stringify({
      success: false,
      error: e.message || 'Unexpected error'
    }), { status: 500, headers: corsHeaders });
  }
});
