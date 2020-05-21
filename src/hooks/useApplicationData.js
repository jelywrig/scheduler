import {useEffect, useState, useReducer} from 'react';
import axios from "axios";


export default function useApplicationData() { 
 
  // recalculates spots for all days - avoids additional prop drilling to distinguish between edit and create
  const getDaysWithUpdatedSpots = function(days, appointments) {
    const newDays = [] 
      for(const day of days) {
        const newDay = {...day};
        newDay.spots = 0;
        for(const appId of day.appointments) {
          if(!appointments[appId].interview) {
            newDay.spots++;
          }
        } 
        newDays.push(newDay);
      }

    return newDays;
  }
 
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.value};
      case SET_APPLICATION_DATA:
        return { ...state, days: action.value[0], appointments: action.value[1], interviewers: action.value[2]};
      case SET_INTERVIEW: {
        const appointments = {
          ...state.appointments,
          [action.value.appointment.id]: action.value.appointment
        };

        return {...state, days: getDaysWithUpdatedSpots(state.days, appointments), appointments};
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  
  
  const [state, dispatch] = useReducer(reducer, {day: "Monday", days: [], appointments: {}, interviewers:{}});
  const setDay = day => dispatch({type: SET_DAY, value: day});

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then((all)=> {
      const action = { type: SET_APPLICATION_DATA, value: [all[0].data, all[1].data, all[2].data]};
      dispatch(action);
    })
  }, []);


  const bookInterview = function(id, interview, create = false) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };

    return axios.put(`/api/appointments/${id}`, appointment)
          .then((res) => {
            const action = { type: SET_INTERVIEW, value:  {appointment} }
            dispatch(action);
          });
  };

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    
    return axios.delete(`/api/appointments/${id}`)
          .then( res => {
            const action = { type: SET_INTERVIEW, value : {appointment}};
            dispatch(action);
          })
  }



  return {state, setDay, bookInterview, cancelInterview};
}