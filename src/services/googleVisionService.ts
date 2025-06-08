
interface SafeSearchAnnotation {
  adult: string;
  spoof: string;
  medical: string;
  violence: string;
  racy: string;
}

interface VisionApiResponse {
  responses: Array<{
    safeSearchAnnotation: SafeSearchAnnotation;
    error?: {
      code: number;
      message: string;
    };
  }>;
}

const SAFE_LEVELS = ['VERY_UNLIKELY', 'UNLIKELY'];

export const moderateImage = async (imageBase64: string, apiKey: string): Promise<{
  isAllowed: boolean;
  results: SafeSearchAnnotation;
  error?: string;
}> => {
  try {
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: imageBase64
            },
            features: [
              {
                type: 'SAFE_SEARCH_DETECTION',
                maxResults: 1
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status} ${response.statusText}`);
    }

    const data: VisionApiResponse = await response.json();
    
    if (data.responses[0]?.error) {
      throw new Error(data.responses[0].error.message);
    }

    const safeSearch = data.responses[0]?.safeSearchAnnotation;
    
    if (!safeSearch) {
      throw new Error('No SafeSearch results returned');
    }

    // Check if all categories are safe
    const isAllowed = SAFE_LEVELS.includes(safeSearch.adult) &&
                     SAFE_LEVELS.includes(safeSearch.violence) &&
                     SAFE_LEVELS.includes(safeSearch.racy) &&
                     SAFE_LEVELS.includes(safeSearch.spoof) &&
                     SAFE_LEVELS.includes(safeSearch.medical);

    return {
      isAllowed,
      results: safeSearch
    };
  } catch (error) {
    console.error('Vision API moderation error:', error);
    return {
      isAllowed: false,
      results: {
        adult: 'UNKNOWN',
        spoof: 'UNKNOWN',
        medical: 'UNKNOWN',
        violence: 'UNKNOWN',
        racy: 'UNKNOWN'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64 content
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
