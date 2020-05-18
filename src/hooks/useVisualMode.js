import React from 'react';

export default function useVisualMode(initialMode) {
  const [mode, setMode] = React.useState(initialMode);
  const [history, setHistory] = React.useState([initialMode]);

  const transition = (newMode, replace = false) => { 
    console.log(history);
    setMode(newMode);
    if(!replace) {
      setHistory(prev => ([...prev, mode]));
    }
  };
  const back = () => {
    if(history.length > 1) {
      setHistory(prev => prev.slice(0, -1))
      setMode(history[history.length - 1]);
    }
  };

  return {mode, transition, back};
}