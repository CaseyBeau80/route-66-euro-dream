
'use client';

import TestUpload from '@/components/TestUpload';

export default function TestUploadPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📤 Test Upload Page</h1>
      <p>Select a JPG or PNG file to upload it to Supabase.</p>
      <TestUpload />
    </main>
  );
}
