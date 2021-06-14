import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData(initial) {

  const [state, setState] = useState({ 
    day: "Monday", 
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  const updateSpots = (state, id, appointments) => {
    const dayId = state.days.findIndex(day => day.appointments.includes(id))

    let counter = 0;

    state.days[dayId].appointments.forEach(appointment => {
      if (!appointments[appointment].interview) {
        counter += 1;
      }
    })
    
    state.days[dayId].spots = counter;
    return state.days;
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(res => {
        updateSpots(state, id, appointments)
        setState({
          ...state,
          appointments
        });
      })
  };
  
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
        updateSpots(state, id, appointments);
        setState({
          ...state, 
          appointments
        });
      })
  };

  useEffect(() => {
    Promise.all([
    axios.get("/api/days"),
    axios.get("/api/appointments"),
    axios.get("/api/interviewers")
    ]).then(all => {
      const [days, appointments, interviewers] = all;
      setState(prev => ({
        ...prev,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      }));
    });
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
} 



