import { TripPlan } from '../../../services/planning/TripPlanBuilder';
import { PDFWeatherIntegrationService } from '../PDFWeatherIntegrationService';

export class PDFWindowService {
  private static pdfWindow: Window | null = null;

  static async openPrintWindow(
    tripPlan: TripPlan,
    tripStartDate?: Date,
    exportOptions?: any,
    shareUrl?: string
  ): Promise<void> {
    console.log('🖨️ Opening PDF content in new window for printing');

    try {
      // Close any existing PDF window
      if (this.pdfWindow && !this.pdfWindow.closed) {
        this.pdfWindow.close();
      }

      // Enrich trip data with weather information
      console.log('🌤️ Enriching trip data with weather information...');
      let enrichedTripPlan = { ...tripPlan };
      
      if (tripStartDate && tripPlan.segments) {
        try {
          const enrichedSegments = await PDFWeatherIntegrationService.enrichSegmentsWithWeather(
            tripPlan.segments,
            tripStartDate
          );
          
          enrichedTripPlan = {
            ...tripPlan,
            segments: enrichedSegments,
            dailySegments: enrichedSegments
          };
          
          console.log('✅ Weather enrichment completed for PDF export');
          console.log('🌤️ Segments with weather data:', 
            enrichedSegments.filter(s => s.weather).length + '/' + enrichedSegments.length
          );
        } catch (weatherError) {
          console.warn('⚠️ Weather enrichment failed, proceeding without weather data:', weatherError);
        }
      }

      // Create new window with proper dimensions
      this.pdfWindow = window.open('', '_blank', 
        'width=1200,height=800,scrollbars=yes,resizable=yes'
      );

      if (!this.pdfWindow) {
        throw new Error('Failed to open new window. Please check popup blocker settings.');
      }

      // Generate HTML content for the PDF with enriched data
      const htmlContent = this.generatePrintHTML(enrichedTripPlan, tripStartDate, exportOptions, shareUrl);
      
      // Write content to new window
      this.pdfWindow.document.write(htmlContent);
      this.pdfWindow.document.close();

      // Wait for content to load, then print
      this.pdfWindow.onload = () => {
        setTimeout(() => {
          if (this.pdfWindow && !this.pdfWindow.closed) {
            console.log('🖨️ Triggering print dialog in new window');
            this.pdfWindow.print();
            
            // Optional: close window after printing (user can cancel)
            setTimeout(() => {
              if (this.pdfWindow && !this.pdfWindow.closed) {
                this.pdfWindow.close();
              }
            }, 1000);
          }
        }, 500);
      };

    } catch (error) {
      console.error('❌ Error opening PDF print window:', error);
      throw error;
    }
  }

  private static generatePrintHTML(
    tripPlan: TripPlan,
    tripStartDate?: Date,
    exportOptions?: any,
    shareUrl?: string
  ): string {
    const startDate = tripStartDate ? new Date(tripStartDate) : new Date();
    const totalDriveHours = tripPlan.segments?.reduce((total, segment) => 
      total + (segment.driveTimeHours || (segment.distance || segment.approximateMiles || 0) / 55), 0
    ) || 0;
    
    // Generate segments HTML matching the web interface design
    const segmentsHTML = tripPlan.segments?.map((segment, index) => {
      const segmentDate = new Date(startDate);
      segmentDate.setDate(startDate.getDate() + index);
      
      return `
        <div class="day-card">
          <div class="day-header">
            <div class="day-circle">
              <span class="day-number">${segment.day || index + 1}</span>
            </div>
            <div class="day-info">
              <h3 class="day-title">Day ${segment.day || index + 1}</h3>
              <p class="day-date">📅 ${segmentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p class="day-route">${segment.startCity} → ${segment.endCity}</p>
            </div>
          </div>
          
          <div class="day-stats">
            <div class="stat-item">
              <span class="stat-icon">📍</span>
              <span class="stat-value">${Math.round(segment.distance || segment.approximateMiles || 0)} MILES</span>
              <span class="stat-label">Total Distance</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">⏰</span>
              <span class="stat-value">${segment.driveTimeHours ? 
                `${Math.round(segment.driveTimeHours * 10) / 10}H ${Math.round((segment.driveTimeHours % 1) * 60)}MIN` :
                `${Math.round((segment.distance || segment.approximateMiles || 0) / 55 * 10) / 10}H`
              }</span>
              <span class="stat-label">Drive Time</span>
            </div>
          </div>

          ${segment.weather ? `
            <div class="weather-section">
              <div class="weather-header">
                <span class="weather-icon">🌤️</span>
                <span class="weather-title">Weather for ${segment.endCity}</span>
                <span class="weather-date">${segmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div class="weather-details">
                <div class="weather-temp">
                  <span class="temp-high">${segment.weather.highTemp || 'N/A'}°F</span>
                  <span class="temp-divider">|</span>
                  <span class="temp-low">${segment.weather.lowTemp || 'N/A'}°F</span>
                </div>
                <div class="weather-info">
                  <span class="weather-condition">${segment.weather.description || 'N/A'}</span>
                  ${segment.weather.humidity ? `<span class="weather-humidity">${segment.weather.humidity}% Humidity</span>` : ''}
                  ${segment.weather.windSpeed ? `<span class="weather-wind">${segment.weather.windSpeed} mph Wind</span>` : ''}
                </div>
                <div class="weather-badge">
                  <span class="live-forecast">🌟 Live Forecast</span>
                </div>
              </div>
            </div>
          ` : ''}

          ${(segment.attractions && segment.attractions.length > 0) || 
            (segment.stops && segment.stops.length > 0) || 
            (segment.recommendedStops && segment.recommendedStops.length > 0) ? `
            <div class="attractions-section">
              <h4 class="attractions-title">📍 Recommended Stops</h4>
              <div class="attractions-grid">
                ${(() => {
                  // Check all possible attraction/stop properties
                  const allStops = [
                    ...(segment.attractions || []),
                    ...(segment.stops || []),
                    ...(segment.recommendedStops || [])
                  ];
                  
                  // Remove duplicates based on name
                  const uniqueStops = allStops.reduce((acc, stop) => {
                    const name = stop.name || stop.title || stop.attraction || 'Unnamed Stop';
                    if (!acc.find(existing => existing.name === name)) {
                      acc.push({ name, ...stop });
                    }
                    return acc;
                  }, []);
                  
                  return uniqueStops.map(stop => 
                    `<div class="attraction-item">
                       <span class="attraction-icon">🎯</span>
                       <span class="attraction-name">${stop.name || stop.title || stop.attraction || 'Unnamed Stop'}</span>
                     </div>`
                  ).join('');
                })()}
              </div>
            </div>
          ` : `
            <div class="attractions-section">
              <h4 class="attractions-title">📍 Recommended Stops</h4>
              <p class="no-attractions">No specific attractions listed for ${segment.endCity}. Explore the area when you arrive!</p>
            </div>
          `}
        </div>
      `;
    }).join('') || '';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Route 66 Trip Plan - ${tripPlan.title || 'My Route 66 Adventure'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background: #f8fafc;
            padding: 0;
            margin: 0;
          }
          
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          
          .hero-header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          
          .hero-title {
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .hero-subtitle {
            font-size: 1.1em;
            opacity: 0.9;
            margin-bottom: 0;
          }
          
          .stats-section {
            background: white;
            padding: 30px;
            margin: 0;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .stat-box {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          
          .stat-box.days { border-color: #3b82f6; }
          .stat-box.miles { border-color: #10b981; }
          .stat-box.hours { border-color: #f59e0b; }
          .stat-box.cost { border-color: #8b5cf6; }
          
          .stat-icon {
            font-size: 1.5em;
            margin-bottom: 8px;
            display: block;
          }
          
          .stat-value {
            font-size: 2em;
            font-weight: 700;
            color: #1f2937;
            display: block;
            margin-bottom: 4px;
          }
          
          .stat-box.days .stat-value { color: #3b82f6; }
          .stat-box.miles .stat-value { color: #10b981; }
          .stat-box.hours .stat-value { color: #f59e0b; }
          .stat-box.cost .stat-value { color: #8b5cf6; }
          
          .stat-label {
            font-size: 0.9em;
            color: #6b7280;
            font-weight: 500;
          }
          
          .itinerary-section {
            background: #f8fafc;
            padding: 40px 30px;
          }
          
          .section-header {
            background: #374151;
            color: white;
            padding: 20px 30px;
            margin: 0 -30px 30px -30px;
            font-size: 1.3em;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .day-card {
            background: white;
            border-radius: 12px;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
          }
          
          .day-header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 20px 25px;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .day-circle {
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1em;
            border: 2px solid rgba(255,255,255,0.3);
          }
          
          .day-info {
            flex: 1;
          }
          
          .day-title {
            font-size: 1.3em;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .day-date {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 2px;
          }
          
          .day-route {
            font-size: 1em;
            opacity: 0.95;
            font-weight: 500;
          }
          
          .day-stats {
            background: #f8fafc;
            padding: 20px 25px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .stat-icon {
            font-size: 1.2em;
            margin-bottom: 6px;
          }
          
          .stat-value {
            font-size: 1.1em;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 2px;
          }
          
          .stat-label {
            font-size: 0.8em;
            color: #6b7280;
            font-weight: 500;
          }
          
          .weather-section {
            background: #eff6ff;
            padding: 20px 25px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .weather-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }
          
          .weather-icon {
            font-size: 1.2em;
          }
          
          .weather-title {
            font-weight: 600;
            color: #1f2937;
            flex: 1;
          }
          
          .weather-date {
            font-size: 0.9em;
            color: #6b7280;
          }
          
          .weather-details {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 15px;
            align-items: center;
          }
          
          .weather-temp {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.1em;
            font-weight: 600;
          }
          
          .temp-high {
            color: #dc2626;
          }
          
          .temp-low {
            color: #2563eb;
          }
          
          .temp-divider {
            color: #9ca3af;
          }
          
          .weather-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            font-size: 0.9em;
          }
          
          .weather-condition {
            color: #1f2937;
            font-weight: 500;
          }
          
          .weather-humidity, .weather-wind {
            color: #6b7280;
            font-size: 0.85em;
          }
          
          .weather-badge {
            text-align: right;
          }
          
          .live-forecast {
            background: #10b981;
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.75em;
            font-weight: 500;
            white-space: nowrap;
          }
          
          .attractions-section {
            padding: 20px 25px;
            background: #fefce8;
          }
          
          .attractions-title {
            color: #92400e;
            font-weight: 600;
            font-size: 1em;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .attractions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
          }
          
          .attraction-item {
            background: white;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #fbbf24;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9em;
          }
          
          .attraction-icon {
            font-size: 1em;
          }
          
          .attraction-name {
            font-weight: 500;
            color: #1f2937;
          }
          
          .no-attractions {
            color: #6b7280;
            font-style: italic;
            font-size: 0.9em;
          }
          
          .footer {
            background: #1f2937;
            color: white;
            padding: 30px;
            text-align: center;
          }
          
          .footer p {
            margin-bottom: 8px;
            font-size: 0.9em;
          }
          
          .footer p:last-child {
            margin-bottom: 0;
            font-size: 0.8em;
            opacity: 0.8;
          }
          
          @media print {
            body {
              background: white;
            }
            
            .container {
              box-shadow: none;
            }
            
            .hero-header {
              background: #4f46e5 !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .day-header {
              background: #3b82f6 !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .day-card {
              break-inside: avoid;
              margin-bottom: 15px;
            }
            
            .stats-section {
              break-inside: avoid;
            }
            
            .weather-section, .attractions-section {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
          
          @page {
            margin: 0.75in;
            size: letter;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="hero-header">
            <h1 class="hero-title">${tripPlan.segments?.[0]?.startCity || 'Chicago'} to ${tripPlan.segments?.[tripPlan.segments.length - 1]?.endCity || 'Tucumcari'}</h1>
            <p class="hero-subtitle">Journey begins: ${startDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}</p>
          </div>

          <div class="stats-section">
            <div class="stats-grid">
              <div class="stat-box days">
                <span class="stat-icon">📅</span>
                <span class="stat-value">${tripPlan.totalDays || tripPlan.segments?.length || 0}</span>
                <span class="stat-label">Days</span>
              </div>
              <div class="stat-box miles">
                <span class="stat-icon">📍</span>
                <span class="stat-value">${Math.round(tripPlan.totalDistance || 0)}</span>
                <span class="stat-label">Miles</span>
              </div>
              <div class="stat-box hours">
                <span class="stat-icon">⏰</span>
                <span class="stat-value">${Math.round(totalDriveHours)}</span>
                <span class="stat-label">Drive Hours</span>
              </div>
              <div class="stat-box cost">
                <span class="stat-icon">💲</span>
                <span class="stat-value">$${Math.round((tripPlan.totalDistance || 0) * 0.65 + (tripPlan.totalDays || 0) * 150)}</span>
                <span class="stat-label">Est. Cost</span>
              </div>
            </div>
          </div>

          <div class="itinerary-section">
            <div class="section-header">
              🗺️ Daily Itinerary
            </div>
            <div class="section-subheader" style="background: #4f46e5; color: white; padding: 15px 20px; margin: -30px -30px 25px -30px; text-align: center; font-size: 0.9em;">
              📋 Your complete day-by-day guide with live weather forecasts<br>
              <small>Trip starts: ${startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</small>
            </div>
            ${segmentsHTML}
          </div>

          <div class="footer">
            <p>Generated by Ramble 66 - Your Route 66 Trip Planner</p>
            <p>Visit ramble66.com to plan your own adventure!</p>
            ${shareUrl ? `<p style="margin-top: 10px; font-size: 0.8em;">Share this trip: ${shareUrl}</p>` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static cleanup(): void {
    if (this.pdfWindow && !this.pdfWindow.closed) {
      this.pdfWindow.close();
      this.pdfWindow = null;
    }
  }
}