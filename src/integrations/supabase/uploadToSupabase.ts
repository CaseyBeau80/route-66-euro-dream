// src/integrations/supabase/uploadToSupabase.ts

import { supabase } from '@/lib/supabase';

export async function uploadToSupabase(file: File) {
  const filePath = `uploads/${file.name}`;

  const { data, error } = await supabase.storage
    .from('photo-challenges')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }

  return data;
}
