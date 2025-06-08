'use client';

import { useState } from 'react';
import { uploadToSupabase } from '@/integrations/supabase/uploadToSupabase';

export default function TestUpload() {
  const [status, setStatus] = useState('');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStatus('Uploading...');
      const result = await uploadToSupabase(file);
      console.log(result);
      setStatus('✅ Upload successful!');
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Upload failed: ${err.message}`);
    }
  }

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <p>{status}</p>
    </div>
  );
}
D
