import { TripPlan } from '../../../services/planning/TripPlanBuilder';

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

      // Create new window with proper dimensions
      this.pdfWindow = window.open('', '_blank', 
        'width=1200,height=800,scrollbars=yes,resizable=yes'
      );

      if (!this.pdfWindow) {
        throw new Error('Failed to open new window. Please check popup blocker settings.');
      }

      // Generate HTML content for the PDF
      const htmlContent = this.generatePrintHTML(tripPlan, tripStartDate, exportOptions, shareUrl);
      
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
    
    // Generate segments HTML
    const segmentsHTML = tripPlan.segments?.map((segment, index) => {
      const segmentDate = new Date(startDate);
      segmentDate.setDate(startDate.getDate() + index);
      
      return `
        <div class="day-segment">
          <div class="day-header">
            <div class="day-number">Day ${segment.day || index + 1}</div>
            <div class="day-info">
              <h3>${segment.startCity} → ${segment.endCity}</h3>
              <p class="date">${segmentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          
          <div class="segment-stats">
            <span class="stat">
              <strong>Distance:</strong> ${Math.round(segment.distance || segment.approximateMiles || 0)} miles
            </span>
            <span class="stat">
              <strong>Drive Time:</strong> ${segment.driveTimeHours ? 
                `${Math.round(segment.driveTimeHours * 10) / 10}h` :
                `${Math.round((segment.distance || segment.approximateMiles || 0) / 55 * 10) / 10}h`
              }
            </span>
          </div>

          ${segment.weather ? `
            <div class="weather-info">
              <strong>Weather:</strong> ${segment.weather.description || 'N/A'} | 
              High: ${segment.weather.highTemp || 'N/A'}°F | 
              Low: ${segment.weather.lowTemp || 'N/A'}°F
              ${segment.weather.humidity ? `| Humidity: ${segment.weather.humidity}%` : ''}
            </div>
          ` : ''}

          ${segment.attractions && segment.attractions.length > 0 ? `
            <div class="attractions">
              <h4>Recommended Stops:</h4>
              <ul>
                ${segment.attractions.map((attraction: any) => 
                  `<li>${attraction.name}</li>`
                ).join('')}
              </ul>
            </div>
          ` : ''}
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
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #2c3e50;
            background: white;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #e74c3c;
            padding-bottom: 20px;
          }
          
          .header h1 {
            color: #c0392b;
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: bold;
          }
          
          .header .subtitle {
            color: #7f8c8d;
            font-size: 1.2em;
            font-style: italic;
          }
          
          .trip-overview {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 5px solid #3498db;
          }
          
          .trip-overview h2 {
            color: #2c3e50;
            margin-bottom: 15px;
          }
          
          .overview-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
          }
          
          .overview-stat {
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 5px;
            border: 1px solid #ecf0f1;
          }
          
          .overview-stat strong {
            display: block;
            font-size: 1.5em;
            color: #e74c3c;
            margin-bottom: 5px;
          }
          
          .day-segment {
            margin-bottom: 25px;
            border: 1px solid #ecf0f1;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .day-header {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .day-number {
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.1em;
          }
          
          .day-info h3 {
            font-size: 1.3em;
            margin-bottom: 5px;
          }
          
          .date {
            opacity: 0.9;
            font-size: 0.9em;
          }
          
          .segment-stats {
            padding: 15px 20px;
            background: #f8f9fa;
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
          }
          
          .stat {
            font-size: 0.9em;
            color: #5d6d7e;
          }
          
          .weather-info {
            padding: 10px 20px;
            background: #e8f4f8;
            border-top: 1px solid #d5dbdb;
            font-size: 0.9em;
            color: #2c3e50;
          }
          
          .attractions {
            padding: 15px 20px;
            background: #fff5e6;
            border-top: 1px solid #f39c12;
          }
          
          .attractions h4 {
            color: #d68910;
            margin-bottom: 10px;
            font-size: 1em;
          }
          
          .attractions ul {
            list-style: none;
            padding-left: 0;
          }
          
          .attractions li {
            padding: 3px 0;
            padding-left: 15px;
            position: relative;
            font-size: 0.9em;
          }
          
          .attractions li::before {
            content: "📍";
            position: absolute;
            left: 0;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #7f8c8d;
            font-size: 0.9em;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
          }
          
          @media print {
            body {
              padding: 0;
              font-size: 12px;
            }
            
            .header h1 {
              font-size: 2em;
            }
            
            .day-segment {
              break-inside: avoid;
              margin-bottom: 15px;
            }
            
            .trip-overview {
              break-inside: avoid;
            }
          }
          
          @page {
            margin: 0.5in;
            size: letter;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🛣️ ${tripPlan.title || 'Route 66 Adventure'}</h1>
          <p class="subtitle">Your Classic American Road Trip Itinerary</p>
        </div>

        <div class="trip-overview">
          <h2>Trip Overview</h2>
          <div class="overview-stats">
            <div class="overview-stat">
              <strong>${tripPlan.totalDays || tripPlan.segments?.length || 0}</strong>
              <span>Days</span>
            </div>
            <div class="overview-stat">
              <strong>${Math.round(tripPlan.totalDistance || 0)}</strong>
              <span>Miles</span>
            </div>
            <div class="overview-stat">
              <strong>${tripPlan.segments?.length || 0}</strong>
              <span>Segments</span>
            </div>
            ${tripStartDate ? `
            <div class="overview-stat">
              <strong>${startDate.toLocaleDateString()}</strong>
              <span>Start Date</span>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="itinerary">
          ${segmentsHTML}
        </div>

        <div class="footer">
          <p>Generated by Ramble 66 - Your Route 66 Trip Planner</p>
          <p>Visit ramble66.com to plan your own adventure!</p>
          ${shareUrl ? `<p>Share this trip: ${shareUrl}</p>` : ''}
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