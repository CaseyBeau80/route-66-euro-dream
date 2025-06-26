
export class AudioService {
  private static audioInstances: Map<string, HTMLAudioElement> = new Map();

  static async createAudioForMilestone(year: number): Promise<HTMLAudioElement | null> {
    const audioId = `timeline-${year}`;
    
    // Check if audio already exists
    if (this.audioInstances.has(audioId)) {
      return this.audioInstances.get(audioId)!;
    }

    // Try multiple audio sources
    const possibleSources = [
      `/audio/timeline/${year}.mp3`,
      `/audio/timeline/${year}.wav`,
      `/audio/route66-${year}.mp3`,
      // Fallback to a generic Route 66 audio
      '/audio/route66-ambient.mp3'
    ];

    for (const source of possibleSources) {
      try {
        const audio = new Audio();
        
        // Test if the audio file exists
        const testPromise = new Promise<boolean>((resolve) => {
          audio.addEventListener('canplaythrough', () => resolve(true), { once: true });
          audio.addEventListener('error', () => resolve(false), { once: true });
          audio.preload = 'metadata';
          audio.src = source;
        });

        const canPlay = await Promise.race([
          testPromise,
          new Promise<boolean>(resolve => setTimeout(() => resolve(false), 2000)) // 2 second timeout
        ]);

        if (canPlay) {
          console.log(`✅ Audio loaded for ${year}: ${source}`);
          this.audioInstances.set(audioId, audio);
          return audio;
        }
      } catch (error) {
        console.log(`❌ Failed to load audio: ${source}`, error);
        continue;
      }
    }

    console.log(`⚠️ No audio file found for year ${year}, using text-to-speech fallback`);
    return this.createTextToSpeechAudio(year);
  }

  private static createTextToSpeechAudio(year: number): HTMLAudioElement | null {
    // Create a simple text-to-speech audio description
    const milestone = this.getMilestoneDescription(year);
    
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(milestone);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.7;
        
        // Create a dummy audio element that triggers speech synthesis
        const dummyAudio = new Audio();
        dummyAudio.play = () => {
          speechSynthesis.speak(utterance);
          return Promise.resolve();
        };
        dummyAudio.pause = () => {
          speechSynthesis.cancel();
        };
        
        console.log(`🔊 Using text-to-speech for year ${year}`);
        return dummyAudio;
      } catch (error) {
        console.error('Text-to-speech failed:', error);
      }
    }

    return null;
  }

  private static getMilestoneDescription(year: number): string {
    const descriptions: Record<number, string> = {
      1926: "In 1926, Route 66 was officially established, connecting Chicago to Los Angeles across 2,448 miles of American landscape. This marked the beginning of the legendary Mother Road.",
      1946: "In 1946, Bobby Troup wrote the famous song 'Get Your Kicks on Route 66' after driving the route himself. The song, later covered by Nat King Cole and the Rolling Stones, cemented Route 66's place in American culture.",
      1950: "The 1950s marked Route 66's golden age. Post-war prosperity brought millions of travelers, spawning iconic motels, diners, and roadside attractions that became symbols of American road culture.",
      1956: "In 1956, President Eisenhower signed the Interstate Highway Act, beginning the construction of faster interstate highways that would eventually replace Route 66 as America's main cross-country route.",
      1985: "1985 marked the official decommissioning of Route 66 from the U.S. Highway System. The last section was bypassed by Interstate 40 in Arizona, ending Route 66's role as a major highway.",
      1999: "In 1999, Route 66 received official recognition as a Historic Route and National Scenic Byway. This designation began preservation efforts and sparked a tourism renaissance along the historic route."
    };

    return descriptions[year] || `Learn about Route 66's history in ${year}.`;
  }

  static stopAllAudio(): void {
    this.audioInstances.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    // Stop any active speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  static cleanup(): void {
    this.stopAllAudio();
    this.audioInstances.clear();
  }
}
