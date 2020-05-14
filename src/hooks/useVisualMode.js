import React from 'react';

export default function useVisualMode(initialMode) {
  const [mode, setMode] = React.useState(initialMode);
  const [history, setHistory] = React.useState([initialMode]);

  const transition = (newMode, replace = false) => { 
    setMode(newMode);
    if(!replace) {
      history.push(newMode);
    }
  };
  const back = () => {
    if(history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
    }
  };

  return {mode, transition, back};
}