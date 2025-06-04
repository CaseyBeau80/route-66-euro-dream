
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl, postId } = await req.json()
    
    console.log(`📸 Proxying image for post ${postId}: ${imageUrl}`)

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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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

    const imageBlob = await imageResponse.blob()
    const imageBuffer = await imageBlob.arrayBuffer()

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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
