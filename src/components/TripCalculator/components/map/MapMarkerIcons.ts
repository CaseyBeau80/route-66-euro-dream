
export const createStartMarkerIcon = () => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#059669" stroke="white" stroke-width="3"/>
      <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">S</text>
    </svg>
  `),
  scaledSize: new google.maps.Size(32, 32),
  anchor: new google.maps.Point(16, 16)
});

export const createEndMarkerIcon = () => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#dc2626" stroke="white" stroke-width="3"/>
      <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">E</text>
    </svg>
  `),
  scaledSize: new google.maps.Size(32, 32),
  anchor: new google.maps.Point(16, 16)
});

export const createStopMarkerIcon = (index: number) => ({
  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="#f59e0b" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${index + 1}</text>
    </svg>
  `),
  scaledSize: new google.maps.Size(24, 24),
  anchor: new google.maps.Point(12, 12)
});
