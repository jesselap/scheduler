import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import Form from "components/Appointment/Form"
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"
import Error from "components/Appointment/Error"
import useVisualMode from "../../hooks/useVisualMode"

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE  = "CREATE"; 
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "Appointment could not be created";
  const ERROR_DELETE = "Appointment could not be deleted";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  }

  const destroy = () => {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  }
  return (
    <article className="appointment" data-testid="appointment">
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
        {mode === ERROR_SAVE && <Error message={ERROR_SAVE} onClose={back} />}
        {mode === DELETING && <Status message={DELETING} />}
        {mode === ERROR_DELETE && <Error message={ERROR_DELETE} onClose={back} />}
        {mode === CONFIRM && (
          <Confirm onConfirm={destroy} onCancel={back} message="Are you sure you want to delete?" />
        )}
        {mode === EDIT && (
          <Form 
            interviewers={props.interviewers} 
            onCancel={back} 
            onSave={save} 
            name={props.interview.student} 
            interviewer={props.interview.interviewer.id} 
          />
        )}
    </article>
  );
}