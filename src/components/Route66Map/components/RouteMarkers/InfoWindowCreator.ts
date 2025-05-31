
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class InfoWindowCreator {
  static createDestinationInfoWindow(waypoint: Route66Waypoint): google.maps.InfoWindow {
    const cityName = waypoint.name.split(',')[0].split(' - ')[0].trim();
    
    return new google.maps.InfoWindow({
      content: `
        <div style="
          padding: 16px; 
          max-width: 300px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #333;
        ">
          <div style="
            display: flex; 
            align-items: center; 
            margin-bottom: 12px;
            border-bottom: 2px solid #DC2626;
            padding-bottom: 8px;
          ">
            <div style="
              width: 20px; 
              height: 20px; 
              background: linear-gradient(135deg, #F8F6F0, #E6E4DE); 
              border: 1px solid #333; 
              border-radius: 3px; 
              margin-right: 8px; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              font-size: 7px;
              font-weight: bold;
              color: #000;
            ">66</div>
            <h3 style="
              margin: 0; 
              color: #DC2626; 
              font-size: 16px; 
              font-weight: 600;
              flex: 1;
            ">${waypoint.name}</h3>
          </div>
          
          <div style="margin-bottom: 10px;">
            <div style="
              background: #F3F4F6;
              padding: 6px 8px;
              border-radius: 4px;
              font-size: 12px;
              color: #6B7280;
              font-weight: 500;
            ">
              🏁 Major Destination • ${waypoint.state}${waypoint.highway_designation ? ` • ${waypoint.highway_designation}` : ''}
            </div>
          </div>
          
          ${waypoint.description ? `
            <div style="
              margin: 10px 0;
              font-size: 13px;
              color: #4B5563;
              background: #F9FAFB;
              padding: 10px;
              border-radius: 6px;
              border-left: 3px solid #DC2626;
            ">
              ${waypoint.description}
            </div>
          ` : ''}
          
          <div style="
            margin-top: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #9CA3AF;
          ">
            <span>Historic Route 66</span>
            <div style="
              background: #DC2626;
              color: white;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
            ">
              STOP #${waypoint.sequence_order}
            </div>
          </div>
        </div>
      `,
      maxWidth: 320,
      pixelOffset: new google.maps.Size(0, -10)
    });
  }

  static createRegularStopInfoWindow(waypoint: Route66Waypoint): google.maps.InfoWindow {
    return new google.maps.InfoWindow({
      content: `
        <div style="
          padding: 12px; 
          max-width: 260px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #333;
        ">
          <h3 style="
            margin: 0 0 8px 0; 
            color: #DC2626; 
            font-size: 14px; 
            font-weight: 600;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 6px;
          ">${waypoint.name}</h3>
          
          <div style="margin-bottom: 8px;">
            <div style="
              font-size: 11px;
              color: #6B7280;
              background: #F3F4F6;
              padding: 4px 6px;
              border-radius: 3px;
              display: inline-block;
            ">
              📍 Route 66 Stop • ${waypoint.state}${waypoint.highway_designation ? ` • ${waypoint.highway_designation}` : ''}
            </div>
          </div>
          
          ${waypoint.description ? `
            <div style="
              margin: 8px 0 0 0;
              font-size: 12px;
              color: #4B5563;
              background: #F9FAFB;
              padding: 8px;
              border-radius: 4px;
            ">
              ${waypoint.description}
            </div>
          ` : ''}
          
          <div style="
            margin-top: 10px;
            text-align: right;
            font-size: 10px;
            color: #9CA3AF;
          ">
            Waypoint #${waypoint.sequence_order}
          </div>
        </div>
      `,
      maxWidth: 280,
      pixelOffset: new google.maps.Size(0, -5)
    });
  }
}
