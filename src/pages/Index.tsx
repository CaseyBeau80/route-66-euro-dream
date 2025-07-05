
import React from 'react';

const Index = () => {
  return React.createElement('div', { 
    style: { 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    } 
  }, [
    React.createElement('h1', { 
      key: 'title',
      style: { fontSize: '24px', color: 'black', marginBottom: '20px' } 
    }, 'BASIC REACT TEST'),
    React.createElement('p', { 
      key: 'text',
      style: { fontSize: '16px', color: 'blue' } 
    }, 'If you can see this text, React is working but something else is blocking normal rendering.'),
    React.createElement('div', {
      key: 'debug',
      style: { 
        backgroundColor: '#f0f0f0', 
        padding: '10px', 
        marginTop: '20px',
        border: '1px solid #ccc'
      }
    }, `Current time: ${new Date().toLocaleTimeString()}`)
  ]);
};

export default Index;
