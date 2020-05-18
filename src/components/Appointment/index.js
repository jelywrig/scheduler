import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";


export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW)})
    .catch((error => {
      console.log(error);
      transition(ERROR_SAVE, true);
    })) ;
  }



  const deleteAppointment = function() {
    
    transition(DELETING, true);
    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY);
    })
    .catch(error => {
      console.log(error);
      transition(ERROR_DELETE, true);
    });

  }

  return (<article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && <Show student={props.interview.student} interviewer={props.interview.interviewer} onDelete={()=> transition(CONFIRM)} onEdit={() => transition(EDIT)}/>}
    {mode === CREATE && <Form interviewers={props.interviewers} onCancel={back} onSave={save} />}
    {mode === EDIT && <Form interviewers={props.interviewers} name={props.interview.student} interviewer={props.interview.interviewer.id} onCancel={back} onSave={save}/>}
    {mode === SAVING && <Status message="Saving..."/>}
    {mode === DELETING && <Status message="Deleting..."/>}
    {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onCancel={back} onConfirm={deleteAppointment}/>}
    {mode === ERROR_SAVE && <Error message="Could not save due to an error" onClose={back}/>}
    {mode === ERROR_DELETE && <Error message="Could not delete due to an error" onClose={back}/>}

  </article>);
}