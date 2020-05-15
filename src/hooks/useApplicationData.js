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


  const bookInterview = function(id, interview, create = false) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };

    return axios.put(`/api/appointments/${id}`, appointment)
          .then((res) => {
            let delta = create ? -1 : 0;
            const appointments = {
              ...state.appointments,
              [id]: appointment
            };
            setState(prev => ({...prev, days: getDaysWithUpdatedSpots(delta), appointments}));
          });
  };

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    
    return axios.delete(`/api/appointments/${id}`)
          .then( res => {
            const appointments = {
              ...state.appointments,
              [id] : appointment
            }
            setState(prev => ({...prev, days: getDaysWithUpdatedSpots(1), appointments}));
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