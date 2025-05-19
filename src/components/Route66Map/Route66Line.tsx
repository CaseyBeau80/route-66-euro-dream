
const Route66Line = () => {
  const createRoutePath = () => {
    const routePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    routePath.setAttribute('d', 'M645,250 L617,300 L590,320 L560,320 L520,340 L480,370 L450,380 L400,410 L350,410 L300,430 L250,440 L200,450');
    routePath.setAttribute('stroke', '#D92121');
    routePath.setAttribute('stroke-width', '4');
    routePath.setAttribute('fill', 'none');
    routePath.setAttribute('stroke-linecap', 'round');
    routePath.setAttribute('stroke-linejoin', 'round');
    routePath.setAttribute('stroke-dasharray', '6 3');
    
    return routePath;
  };

  return {
    createRoutePath
  };
};

export default Route66Line;
