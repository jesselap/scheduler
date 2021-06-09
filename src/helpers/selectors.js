


export function getAppointmentsForDay(state, day) {
  const result = [];
  const dayData = state.days.find(element => element.name === day)
  if (!dayData) {
    return result;
  }
  const appointments = dayData.appointments
  for (let appointment of appointments) {
    result.push(state.appointments[appointment])
  }

  return result;



}

