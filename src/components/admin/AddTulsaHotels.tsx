import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export const AddTulsaHotels = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addHotels = async () => {
    setLoading(true);
    setMessage('');

    const hotels = [
      {
        title: 'Mayo Hotel',
        description: 'Historic luxury hotel in downtown Tulsa, originally built in 1925. This iconic art deco building has been beautifully restored and offers elegant accommodations in the heart of the city.',
        latitude: 36.150889,
        longitude: -95.9919889,
        city_name: 'Tulsa',
        website: 'https://www.themayohotel.com'
      },
      {
        title: 'The Campbell Hotel',
        description: 'A boutique hotel and event center featuring 26 uniquely decorated rooms. Recently added to the National Register of Historic Places, this 1920s hotel captures Tulsa\'s celebrated history and is conveniently located on Historic Route 66.',
        latitude: 36.1314,
        longitude: -95.9478,
        city_name: 'Tulsa',
        website: 'https://thecampbellhotel.com'
      }
    ];

    try {
      const { data, error } = await supabase
        .from('hidden_gems')
        .insert(hotels)
        .select();

      if (error) {
        setMessage(`Error: ${error.message}`);
        return;
      }

      setMessage(`✅ Successfully added ${data?.length || 0} hotels to hidden gems!`);
    } catch (error) {
      setMessage(`Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add Tulsa Hotels to Hidden Gems</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This will add Mayo Hotel and The Campbell Hotel to the hidden gems table.
      </p>
      <Button onClick={addHotels} disabled={loading}>
        {loading ? 'Adding...' : 'Add Hotels'}
      </Button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('Error') || message.includes('Exception') ? 'text-destructive' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};