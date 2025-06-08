
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface ModerationResult {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

export const uploadPhotoChallenge = async (
  file: File,
  stopId: string,
  moderationResult: ModerationResult,
  tripId?: string,
  userSessionId?: string
): Promise<{ success: boolean; photoUrl?: string; error?: string }> => {
  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `challenges/${fileName}`;

    console.log('Uploading file to Supabase storage:', filePath);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('photo-challenges')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('photo-challenges')
      .getPublicUrl(filePath);

    console.log('File uploaded successfully, public URL:', publicUrl);

    // Insert record into photo_challenges table
    const { data: challengeData, error: challengeError } = await supabase
      .from('photo_challenges')
      .insert({
        photo_url: publicUrl,
        stop_id: stopId,
        trip_id: tripId,
        user_session_id: userSessionId,
        moderation_result: moderationResult as any // Cast to Json type
      })
      .select()
      .single();

    if (challengeError) {
      console.error('Database insert error:', challengeError);
      // Clean up uploaded file if database insert fails
      await supabase.storage
        .from('photo-challenges')
        .remove([filePath]);
      throw new Error(`Database error: ${challengeError.message}`);
    }

    console.log('Photo challenge created successfully:', challengeData);

    return {
      success: true,
      photoUrl: publicUrl
    };
  } catch (error) {
    console.error('Photo challenge upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const insertModerationResult = async (
  photoId: string,
  moderationResult: ModerationResult
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('moderation_results')
      .insert({
        photo_id: photoId,
        result: moderationResult as any // Cast to Json type
      });

    if (error) {
      console.error('Moderation result insert error:', error);
      throw new Error(`Failed to save moderation result: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Insert moderation result error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
