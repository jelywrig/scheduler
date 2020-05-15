import {useEffect, useState } from 'react';
import axios from "axios";


export default function useApplicationData() { 
  const [state, setState] = useState({day: "Monday", days: [], appointments: {}, interviewers:{}});
  
  const setDay = day => setState({...state, day});

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then((all)=> {
      setState( prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, []);


  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
          .then((res) => {
            const days = getDaysWithUpdatedSpots(-1);
            setState({...state, days, appointments});
          });
  };

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id] : appointment
    }
    
    return axios.delete(`/api/appointments/${id}`)
          .then( res => {
            const days = getDaysWithUpdatedSpots(1);
            setState({...state, days, appointments});
          })
  }

  const getDaysWithUpdatedSpots = function(changeCurrentDaysSpotsBy) {
  
    const newDays= state.days.map(day => {
      if(day.name === state.day) {
        return {...day, spots: day.spots + changeCurrentDaysSpotsBy}
      } else {
        return day;
      }

    });

    return newDays;
  }


  return {state, setDay, bookInterview, cancelInterview};
}