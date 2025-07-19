import { supabase } from '../src/integrations/supabase/client';

const addTulsaHotels = async () => {
  console.log('🏨 Adding Tulsa hotels to hidden_gems table...');

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
      console.error('❌ Error adding hotels:', error);
      return;
    }

    console.log('✅ Successfully added hotels:', data);
    console.log(`🏨 Added ${data?.length || 0} hotels to hidden_gems table`);
  } catch (error) {
    console.error('❌ Exception adding hotels:', error);
  }
};

// Run the script
addTulsaHotels();