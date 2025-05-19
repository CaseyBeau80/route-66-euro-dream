
// Route 66 states data with more accurate path data
export const route66States = [
  { id: "IL", name: "Illinois", d: "M617,300 L645,250 L670,240 L690,280 L650,310 L617,300 Z", color: "#5D7B93", isRoute66: true },
  { id: "MO", name: "Missouri", d: "M560,320 L617,300 L650,310 L640,350 L590,360 L560,320 Z", color: "#5D7B93", isRoute66: true },
  { id: "KS", name: "Kansas", d: "M530,335 L560,320 L590,360 L570,380 L530,370 L530,335 Z", color: "#5D7B93", isRoute66: true },
  { id: "OK", name: "Oklahoma", d: "M460,380 L530,370 L570,380 L550,410 L480,420 L460,380 Z", color: "#5D7B93", isRoute66: true },
  { id: "TX", name: "Texas", d: "M430,420 L480,420 L460,460 L410,440 L430,420 Z", color: "#5D7B93", isRoute66: true },
  { id: "NM", name: "New Mexico", d: "M350,410 L410,440 L380,490 L320,470 L350,410 Z", color: "#5D7B93", isRoute66: true },
  { id: "AZ", name: "Arizona", d: "M270,425 L320,470 L290,500 L240,450 L270,425 Z", color: "#5D7B93", isRoute66: true },
  { id: "CA", name: "California", d: "M180,450 L240,450 L260,490 L200,510 L180,450 Z", color: "#5D7B93", isRoute66: true }
];

// Additional US States (non-Route 66)
export const otherUSStates = [
  { id: "WA", name: "Washington", d: "M160,250 L140,220 L195,220 L210,260 L160,250 Z", color: "#d3d3d3", isRoute66: false },
  { id: "OR", name: "Oregon", d: "M150,270 L160,250 L210,260 L220,300 L165,310 L150,270 Z", color: "#d3d3d3", isRoute66: false },
  { id: "ID", name: "Idaho", d: "M210,260 L230,220 L270,230 L260,310 L220,300 L210,260 Z", color: "#d3d3d3", isRoute66: false },
  { id: "MT", name: "Montana", d: "M230,220 L240,180 L330,190 L325,230 L270,230 L230,220 Z", color: "#d3d3d3", isRoute66: false },
  { id: "WY", name: "Wyoming", d: "M270,230 L325,230 L320,280 L260,280 L270,230 Z", color: "#d3d3d3", isRoute66: false },
  { id: "NV", name: "Nevada", d: "M165,310 L220,300 L210,380 L155,370 L165,310 Z", color: "#d3d3d3", isRoute66: false },
  { id: "UT", name: "Utah", d: "M220,300 L260,310 L255,380 L210,380 L220,300 Z", color: "#d3d3d3", isRoute66: false },
  { id: "CO", name: "Colorado", d: "M260,310 L320,280 L360,320 L300,330 L260,310 Z", color: "#d3d3d3", isRoute66: false },
  { id: "ND", name: "North Dakota", d: "M330,190 L400,180 L395,220 L325,230 L330,190 Z", color: "#d3d3d3", isRoute66: false },
  { id: "SD", name: "South Dakota", d: "M325,230 L395,220 L390,260 L320,280 L325,230 Z", color: "#d3d3d3", isRoute66: false },
  { id: "NE", name: "Nebraska", d: "M320,280 L390,260 L420,280 L410,310 L360,320 L320,280 Z", color: "#d3d3d3", isRoute66: false },
  { id: "IA", name: "Iowa", d: "M470,260 L490,230 L535,240 L530,270 L470,280 L470,260 Z", color: "#d3d3d3", isRoute66: false },
  { id: "MN", name: "Minnesota", d: "M440,200 L460,170 L490,180 L510,210 L490,230 L440,200 Z", color: "#d3d3d3", isRoute66: false },
  { id: "WI", name: "Wisconsin", d: "M530,220 L540,180 L570,200 L600,220 L570,240 L530,220 Z", color: "#d3d3d3", isRoute66: false },
  { id: "MI", name: "Michigan", d: "M600,220 L630,180 L650,190 L665,220 L630,240 L600,220 Z", color: "#d3d3d3", isRoute66: false },
  { id: "IN", name: "Indiana", d: "M600,270 L615,245 L630,245 L650,280 L615,300 L600,270 Z", color: "#d3d3d3", isRoute66: false },
  { id: "OH", name: "Ohio", d: "M650,240 L670,220 L695,245 L675,265 L650,280 L650,240 Z", color: "#d3d3d3", isRoute66: false },
  { id: "PA", name: "Pennsylvania", d: "M700,240 L740,225 L760,255 L730,270 L700,250 L700,240 Z", color: "#d3d3d3", isRoute66: false },
  { id: "NY", name: "New York", d: "M730,225 L745,200 L780,205 L790,230 L760,255 L730,225 Z", color: "#d3d3d3", isRoute66: false },
  { id: "VT", name: "Vermont", d: "M780,205 L790,185 L800,205 L790,230 L780,205 Z", color: "#d3d3d3", isRoute66: false },
  { id: "NH", name: "New Hampshire", d: "M800,205 L810,185 L815,210 L800,230 L800,205 Z", color: "#d3d3d3", isRoute66: false },
  { id: "ME", name: "Maine", d: "M815,210 L810,170 L840,180 L820,220 L815,210 Z", color: "#d3d3d3", isRoute66: false },
  { id: "MA", name: "Massachusetts", d: "M790,230 L815,230 L820,240 L790,240 L790,230 Z", color: "#d3d3d3", isRoute66: false },
  { id: "RI", name: "Rhode Island", d: "M820,240 L825,235 L828,245 L822,248 L820,240 Z", color: "#d3d3d3", isRoute66: false },
  { id: "CT", name: "Connecticut", d: "M790,240 L815,240 L820,255 L800,260 L790,240 Z", color: "#d3d3d3", isRoute66: false },
  { id: "NJ", name: "New Jersey", d: "M760,255 L775,250 L780,270 L770,280 L760,255 Z", color: "#d3d3d3", isRoute66: false },
  { id: "DE", name: "Delaware", d: "M775,275 L780,270 L785,285 L775,290 L775,275 Z", color: "#d3d3d3", isRoute66: false },
  { id: "MD", name: "Maryland", d: "M750,275 L780,270 L775,290 L740,290 L750,275 Z", color: "#d3d3d3", isRoute66: false },
  { id: "WV", name: "West Virginia", d: "M730,270 L750,270 L745,300 L720,300 L710,280 L730,270 Z", color: "#d3d3d3", isRoute66: false },
  { id: "VA", name: "Virginia", d: "M750,270 L790,275 L780,310 L750,310 L745,300 L750,270 Z", color: "#d3d3d3", isRoute66: false },
  { id: "NC", name: "North Carolina", d: "M750,310 L780,310 L770,330 L720,330 L750,310 Z", color: "#d3d3d3", isRoute66: false },
  { id: "SC", name: "South Carolina", d: "M750,330 L770,330 L780,350 L750,360 L750,330 Z", color: "#d3d3d3", isRoute66: false },
  { id: "GA", name: "Georgia", d: "M730,330 L750,330 L750,370 L700,380 L700,350 L730,330 Z", color: "#d3d3d3", isRoute66: false },
  { id: "FL", name: "Florida", d: "M710,380 L730,370 L760,380 L780,400 L740,440 L700,410 L710,380 Z", color: "#d3d3d3", isRoute66: false },
  { id: "AL", name: "Alabama", d: "M680,350 L700,350 L700,390 L670,390 L680,350 Z", color: "#d3d3d3", isRoute66: false },
  { id: "MS", name: "Mississippi", d: "M660,350 L680,350 L670,400 L640,400 L660,350 Z", color: "#d3d3d3", isRoute66: false },
  { id: "TN", name: "Tennessee", d: "M670,330 L720,330 L740,340 L650,350 L670,330 Z", color: "#d3d3d3", isRoute66: false },
  { id: "KY", name: "Kentucky", d: "M670,310 L710,300 L730,310 L670,330 L670,310 Z", color: "#d3d3d3", isRoute66: false },
  { id: "AR", name: "Arkansas", d: "M590,360 L640,350 L625,400 L580,390 L590,360 Z", color: "#d3d3d3", isRoute66: false },
  { id: "LA", name: "Louisiana", d: "M580,390 L625,400 L610,430 L580,440 L570,420 L580,390 Z", color: "#d3d3d3", isRoute66: false }
];

// Combined states for rendering all together
export const allUSStates = [...route66States, ...otherUSStates];
