
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const ALLOWED_ORIGINS = new Set<string>([
  'https://ramble66.com',
  'https://www.ramble66.com',
  'http://localhost:5173'
]);

function isPreviewOrigin(origin: string | null) {
  // Only allow preview origins in development environment
  const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development';
  if (!isDevelopment || !origin) return false;
  try {
    const hostname = new URL(origin).hostname;
    return hostname.endsWith('.lovable.dev') || hostname.endsWith('.webcontainer.io');
  } catch {
    return false;
  }
}

function getCorsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin'
  };
  if (origin && (ALLOWED_ORIGINS.has(origin) || isPreviewOrigin(origin))) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}


serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    if (!corsHeaders['Access-Control-Allow-Origin']) {
      return new Response('CORS origin not allowed', { status: 403, headers: { 'Vary': 'Origin' } });
    }
    return new Response(null, { headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Max-Age': '86400' } })
  }

  try {
    const { imageUrl, postId } = await req.json()

    // Basic validation
    const postIdSafe = typeof postId === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(postId);
    let parsedUrl: URL | null = null;
    try { parsedUrl = new URL(String(imageUrl)); } catch (_) {}

    const ALLOWED_HOSTS = ['instagram.com','cdninstagram.com','fbcdn.net','fbcdn.com'];
    const isAllowedHost = parsedUrl && ALLOWED_HOSTS.some(h => parsedUrl!.hostname === h || parsedUrl!.hostname.endsWith(`.${h}`));

    if (!postIdSafe || !parsedUrl || parsedUrl.protocol !== 'https:' || !isAllowedHost) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid image URL or postId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    console.log(`📸 Proxying image for post ${postId}: ${parsedUrl.href}`)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if we already have this image stored
    const { data: existingFile } = await supabase.storage
      .from('instagram-images')
      .list('', { search: `${postId}.jpg` })

    if (existingFile && existingFile.length > 0) {
      console.log(`✅ Found cached image for post ${postId}`)
      const { data: publicUrl } = supabase.storage
        .from('instagram-images')
        .getPublicUrl(`${postId}.jpg`)
      
      return new Response(JSON.stringify({ 
        success: true, 
        imageUrl: publicUrl.publicUrl,
        cached: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' }
      })
    }

    // Fetch the image from Instagram
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    })

    if (!imageResponse.ok) {
      console.error(`❌ Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch image from Instagram' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const contentType = imageResponse.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid content type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const MAX_BYTES = 5_000_000; // 5MB
    const contentLength = parseInt(imageResponse.headers.get('content-length') || '0')
    if (contentLength && contentLength > MAX_BYTES) {
      return new Response(JSON.stringify({ success: false, error: 'Image too large' }), { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const imageBlob = await imageResponse.blob()
    const imageBuffer = await imageBlob.arrayBuffer()
    if (imageBuffer.byteLength > MAX_BYTES) {
      return new Response(JSON.stringify({ success: false, error: 'Image too large' }), { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Store the image in Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('instagram-images')
      .upload(`${postId}.jpg`, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error(`❌ Failed to store image: ${uploadError.message}`)
      // Still return the proxied image even if storage fails
      const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))
      return new Response(JSON.stringify({ 
        success: true, 
        imageUrl: `data:image/jpeg;base64,${base64}`,
        cached: false,
        storageError: uploadError.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the public URL of the stored image
    const { data: publicUrl } = supabase.storage
      .from('instagram-images')
      .getPublicUrl(`${postId}.jpg`)

    console.log(`✅ Successfully proxied and stored image for post ${postId}`)

  return new Response(JSON.stringify({ 
    success: true, 
    imageUrl: publicUrl.publicUrl,
    cached: false 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' }
  })

  } catch (error) {
    console.error('❌ Error in instagram-proxy function:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
