

export function getAppointmentsForDay(state, day){
  const {days, appointments} = state;
  if(days.length === 0) {
    return [];
  }
  const selectedDay = days.filter(d => d.name === day)[0];
  if(!selectedDay) {
    return [];
  }
  const result = [];

  for(const id in appointments){
    if(selectedDay.appointments.includes(Number(id))){
      result.push(appointments[id]);
    }
  }
  return result;
};

export function getInterview(state, interview) {
  
  if( interview && interview.interviewer){
    const newInterview = { student: interview.student, interviewer: state.interviewers[interview.interviewer]};
    return newInterview;
  }

  return null;

};