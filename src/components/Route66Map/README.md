
# Route 66 Google Maps Implementation

## Setup Instructions

### Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Maps JavaScript API
4. Create an API key in the Credentials section
5. You may want to restrict the API key to your domain for security

### Adding Your API Key

Replace the placeholder in `src/components/Route66Map/GoogleMapsRoute66.tsx`:

```javascript
const { isLoaded, loadError } = useJsApiLoader({
  id: 'google-map-script',
  googleMapsApiKey: 'YOUR_API_KEY', // Replace with your Google Maps API key
});
```

### API Key Security

For production, consider:
- Adding API key restrictions in the Google Cloud Console
- Using environment variables to store your API key
- Implementing a backend proxy to handle requests to Google Maps API
