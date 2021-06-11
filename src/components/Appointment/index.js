import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import Form from "components/Appointment/Form"
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"
import useVisualMode from "../../hooks/useVisualMode"

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE  = "CREATE"; 
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    })
  }
  const destroy = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    }
    transition(DELETING);
    props.deleteInterview(props.id, interview).then(() => {
      transition(EMPTY);
    })
  }
  return (
    <article className="appointment">
      <Header time={props.time}></Header>
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
        )}  
        {mode === CREATE && (
          <Form interviewers={props.interviewers} onCancel={back} onSave={save}/>
        )}
        {mode === SAVING && <Status message={SAVING} />}
        {mode === DELETING && <Status message={DELETING} />}
        {mode === CONFIRM && (
          <Confirm onConfirm={destroy} onCancel={back} message={DELETING} />
        )}
        {mode === EDIT && (
          <Form interviewers={props.interviewers} onCancel={back} onSave={save} name={props.interview.student} interviewer={props.interview.interviewer.id} />
        )}
    </article>
  );
}