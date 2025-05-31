
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class InfoWindowCreator {
  static createDestinationInfoWindow(waypoint: Route66Waypoint): google.maps.InfoWindow {
    const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
    
    const contentString = `
      <div style="max-width: 300px; padding: 10px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #000000, #333333); color: white; padding: 12px; margin: -10px -10px 12px -10px; border-radius: 8px 8px 0 0;">
          <h3 style="margin: 0; font-size: 18px; font-weight: bold; text-align: center;">
            🏙️ ${cityName}
          </h3>
          <p style="margin: 4px 0 0 0; font-size: 14px; text-align: center; opacity: 0.9;">
            ${waypoint.state} • Route 66 Destination
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px; border: 2px solid #000000;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="background: #000000; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
              MAJOR STOP
            </span>
            ${waypoint.highway_designation ? `
              <span style="background: #666666; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                ${waypoint.highway_designation}
              </span>
            ` : ''}
          </div>
          
          <div style="font-size: 13px; color: #000000; line-height: 1.4;">
            <strong>📍 Location:</strong> ${waypoint.latitude.toFixed(4)}, ${waypoint.longitude.toFixed(4)}<br>
            <strong>🎯 Stop Order:</strong> #${waypoint.sequence_order}
          </div>
        </div>
        
        ${waypoint.description ? `
          <div style="background: #ffffff; border-left: 4px solid #000000; padding: 10px; margin-bottom: 10px; border: 1px solid #cccccc;">
            <p style="margin: 0; font-size: 13px; color: #000000; line-height: 1.4;">
              ${waypoint.description}
            </p>
          </div>
        ` : ''}
        
        <div style="text-align: center; padding-top: 8px; border-top: 2px solid #000000;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span style="background: #ffffff; color: #000000; padding: 2px 6px; border-radius: 50%; font-size: 10px; font-weight: bold; border: 1px solid #000000;">66</span>
            <span style="font-size: 12px; font-weight: bold; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
              Historic Route 66
            </span>
            <span style="background: #ffffff; color: #000000; padding: 2px 6px; border-radius: 50%; font-size: 10px; font-weight: bold; border: 1px solid #000000;">66</span>
          </div>
        </div>
      </div>
    `;

    return new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 350,
      pixelOffset: new google.maps.Size(0, -10)
    });
  }
}
