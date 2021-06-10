


export function getAppointmentsForDay(state, day) {
  const dayData = state.days.find(element => element.name === day)
  
  if (dayData) return dayData.appointments.map(id => state.appointments[id]);
  else return [];
}


export function getInterviewersForDay(state, day) {
  const dayData = state.days.find(element => element.name === day)
  
  if (dayData) return dayData.interviewers.map(id => state.interviewers[id]);
  else return [];
}




export function getInterview(state, interview) {
  return interview
  ? {
      student: interview.student,
      interviewer: { ...state.interviewers[interview.interviewer] },
    }
  : null;
}

