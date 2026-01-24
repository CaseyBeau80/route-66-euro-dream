import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.41ccfe218467498db09f3abb2c891a8e',
  appName: 'Ramble 66',
  webDir: 'dist',
  server: {
    url: 'https://41ccfe21-8467-498d-b09f-3abb2c891a8e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#1B60A3'
  },
  android: {
    backgroundColor: '#1B60A3'
  }
};

export default config;
