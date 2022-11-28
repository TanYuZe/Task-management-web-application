import React, { useState, useEffect, useContext } from "react"
import axios from "axios"

import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

//Context
import ApplicationContext from "../../context/appContext"
import AuthContext from "../../context/authContext"

function TaskinfoModal(props) {
  //const {username} = useContext(AuthContext)
  const { app, taskInfo, username, usergroup, createRights, openRights, toDoListRights, doingRights, doneRights } = props

  const [taskName, setTaskName] = useState("")
  const [addToPlan, setAddToPlan] = useState([])
  const [taskDescription, setTaskDescription] = useState("")
  const [taskNote, setTaskNote] = useState("")
  //const [username, setUsername] = useState("")
  const [plans, setplans] = useState([])
  const [show, setShow] = useState(false)
  const handleClose = () => {
    setShow(false)
  }
  const handleShow = () => {
    setShow(true)
  }
  const clickEvent = () => {
    handleShow()
    axios
      .post("http://localhost:3001/getplans", {
        acronym: app
      })
      .then(res => {
        console.log(res.data[0].Plan_MVP_name)
        setplans(res.data)
      })
  }
  useEffect(() => {
    axios
      .post("http://localhost:3001/getplans", {
        acronym: app
      })
      .then(res => {
        setplans(res.data)
      })
  }, [])
  //const { plans, updateTasks, openRights } = props
  //const plans = ["LOL", "GG", "HI", "BYE"]
  //const { thisUsername } = useContext(AuthContext)
  // const { currApplication } = useContext(ApplicationContext);
  // const application = currApplication;
  const application = ""
  //Toast
  const notify = status => {}

  //Plan selector
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }
  //dummy values to test insert

  //Submit Create Task
  async function handleCreateTaskSubmit(e) {
    e.preventDefault()
    console.log(username)
    if (app != "All") {
      axios.post("http://localhost:3001/updatetask", {
        username: username,
        application: app,
        currentState: taskInfo.Task_state,
        taskID: taskInfo.Task_id,
        taskName: taskInfo.Task_name,
        addToPlan: addToPlan,
        taskDescription: taskDescription,
        taskNote: taskNote
      })
      setTaskDescription("")
    }
  }

  const handleTaskNameChange = event => {
    setTaskName(event.target.value)
    // console.log(taskName);
  }

  const handleTaskDescriptionChange = event => {
    setTaskDescription(event.target.value)
  }

  const handlePlanChange = event => {
    setAddToPlan(event.target.value)
  }

  const handleTaskNoteChange = event => {
    setTaskNote(event.target.value)
  }

  const handleCloseCreateModal = event => {}

  //reload form
  async function reloadForm(e) {
    document.getElementById("createTaskForm").reset()
    document.getElementById("task-name").focus()
    setTaskName("")
    setAddToPlan("")
    setTaskDescription("")
    setTaskNote("")
  }
  function savebutton(task) {
    if (task.Task_state === "open" && openRights.includes(usergroup)) {
      return (
        <>
          <Button variant="primary" onClick={handleCreateTaskSubmit}>
            Save Changes
          </Button>{" "}
        </>
      )
    }
    //todo
    if (task.Task_state === "toDoList" && toDoListRights.includes(usergroup)) {
      return (
        <>
          <Button variant="primary" onClick={handleCreateTaskSubmit}>
            Save Changes
          </Button>{" "}
        </>
      )
    }
    if (task.Task_state === "doing" && doingRights.includes(usergroup)) {
      return (
        <>
          <Button variant="primary" onClick={handleCreateTaskSubmit}>
            Save Changes
          </Button>{" "}
        </>
      )
    }
    //done
    if (task.Task_state === "done" && doneRights.includes(usergroup)) {
      return (
        <>
          <Button variant="primary" onClick={handleCreateTaskSubmit}>
            Save Changes
          </Button>{" "}
        </>
      )
    }
    
  }
  // function savebutton(task)
  // {
  //   // if(task.Task_state !=="open" && usergroup !== "project manager")
  //   // {
  //   // if(task.Task_state ==="open" && usergroup==="project lead")
  //   // {
  //   //   return(<><Button disabled={taskInfo.Task_state==="toDoList" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager"} variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   // }
  //   if(openRights.includes(usergroup))
  //   {
  //     return(<><Button disabled={taskInfo.Task_state==="toDoList" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager"} variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   }
  //   if(task.Task_state==="open" &&  openRights.includes(usergroup))
  //   {
  //     return(<><Button disabled={taskInfo.Task_state==="toDoList" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager"} variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   }
  //   //todo
  //   if(task.Task_state==="toDoList" &&  toDoListRights.includes(usergroup))
  //   {
  //     return(<><Button disabled={taskInfo.Task_state==="toDoList" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager"} variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   }

  //   if(task.Task_state==="toDoList" &&  openRights.includes(usergroup))
  //   {
  //     return(<><Button disabled={taskInfo.Task_state==="toDoList" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager"} variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   }
  //   //doing
  //   if(task.Task_state==="doing" &&  doingRights.includes(usergroup))
  //   {
  //     return(<><Button disabled={taskInfo.Task_state==="toDoList" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager"} variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   }
  //   //done
  //   if(task.Task_state==="done" &&  doneRights.includes(usergroup))
  //   {
  //     return(<><Button disabled={taskInfo.Task_state==="toDoList" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager"} variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   }
  //   if(task.Task_state==="done" &&  usergroup.includes("team member"))
  //   {
  //     return(<><Button disabled={taskInfo.Task_state==="toDoList" &&  usergroup==="project manager" || taskInfo.Task_state==="close" || taskInfo.Task_state==="done" &&  usergroup==="project manager"} variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   }

  // // else if(task.Task_state ==="doing" && usergroup === "project manager")
  // //   {
  // //     return(<><Button variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  // //   }
  // //   else
  // //   {
  // //     return(<><Button variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  // //   }

  //   //close
  //   // if(task.Task_state==="close" &&  doneRights.includes(usergroup))
  //   // {
  //   //   return(<><Button variant="primary" onClick={handleCreateTaskSubmit}>Save Changes</Button></>)
  //   // }
  // }

  function selectplans(plans) {
    if (openRights.includes(usergroup) && taskInfo.Task_state === "open") {
      return (
        <>
          <InputLabel id="demo-multiple-name-label">Add to Plan</InputLabel>
          <Select labelId="demo-multiple-name-label" id="demo-multiple-name" defaultValue={taskInfo.Task_plan ? taskInfo.Task_plan : "none"} onChange={handlePlanChange} input={<OutlinedInput label="Add to Plan" />} MenuProps={MenuProps}>
            <MenuItem key={"none"} value={"none"}>
              None
            </MenuItem>
            {plans.map(plan => (
              <MenuItem key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}>
                {plan.Plan_MVP_name}
              </MenuItem>

              //<option value={plan}>{plan}</option>
            ))}
          </Select>
        </>
      )
    } 
    else if (doneRights.includes(usergroup) && taskInfo.Task_state === "done") {
      return (
        <>
          <InputLabel id="demo-multiple-name-label">Add to Plan</InputLabel>
          <Select labelId="demo-multiple-name-label" id="demo-multiple-name" defaultValue={taskInfo.Task_plan ? taskInfo.Task_plan : "none"} onChange={handlePlanChange} input={<OutlinedInput label="Add to Plan" />} MenuProps={MenuProps}>
            <MenuItem key={"none"} value={"none"}>
              None
            </MenuItem>
            {plans.map(plan => (
              <MenuItem key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}>
                {plan.Plan_MVP_name}
              </MenuItem>

              //<option value={plan}>{plan}</option>
            ))}
          </Select>
        </>
      )
    }else {
      return (
        <>
          <InputLabel id="demo-multiple-name-label">Add to Plan</InputLabel>
          <Select disabled labelId="demo-multiple-name-label" id="demo-multiple-name" defaultValue={taskInfo.Task_plan ? taskInfo.Task_plan : "none"} onChange={handlePlanChange} input={<OutlinedInput label="Add to Plan" />} MenuProps={MenuProps}>
            <MenuItem key={"none"} value={"none"}>
              None
            </MenuItem>
            {plans.map(plan => (
              <MenuItem key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}>
                {plan.Plan_MVP_name}
              </MenuItem>

              //<option value={plan}>{plan}</option>
            ))}
          </Select>
        </>
      )
    }
  }
  function textareastatus() {
    if (taskInfo.Task_state === "open" && openRights.includes(usergroup)) {
      return (
        <>
          <label htmlFor="task-note">Notes</label>
          <textarea className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
        </>
      )
    }
    //todo
    else if (taskInfo.Task_state === "toDoList" && toDoListRights.includes(usergroup)) {
      return (
        <>
          <label htmlFor="task-note">Notes</label>
          <textarea className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
        </>
      )
    } else if (taskInfo.Task_state === "doing" && doingRights.includes(usergroup)) {
      return (
        <>
          <label htmlFor="task-note">Notes</label>
          <textarea className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
        </>
      )
    }
    //done
    else if (taskInfo.Task_state === "done" && doneRights.includes(usergroup)) {
      return (
        <>
          <label htmlFor="task-note">Notes</label>
          <textarea className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
        </>
      )
    }
    // else if (createRights.includes(usergroup) && taskInfo.Task_state === "done") {
    //   return (
    //     <>
    //       <label htmlFor="task-note">Notes</label>
    //       <textarea className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
    //     </>
    //   )
    // } 
    else {
      return (
        <>
          <label htmlFor="task-note">Notes</label>
          <textarea disabled className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
        </>
      )
    }
  }
  return (
    // Testing
    <>
      <Button onClick={clickEvent}>info</Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Information </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="createTaskForm" onSubmit={handleCreateTaskSubmit} autoComplete="off">
            <div className="form row">
              {/* Left */}
              <div className="col-6">
                <div className="form-row py-lg-3">
                  <div className="col-12">
                    <label className="" htmlFor="task-name">
                      Task Name
                    </label>
                    <input disabled value={taskInfo.Task_name} id="task-name" type="text" className="form-control" onChange={handleTaskNameChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-12 py-lg-2">
                    <label className="" htmlFor="task-id">
                      Task ID
                    </label>
                    <input disabled id="task-id" type="text" value={taskInfo.Task_id} className="form-control" />
                  </div>
                </div>
                <div className="form-row py-lg-2">
                  <div className="col-12">
                    <FormControl
                      fullWidth
                      // disabled={
                      //   !openRights
                      //     ? true
                      //     : false
                      // }
                    >
                      {selectplans(plans)}
                      {/* value={addToPlan.length !== 0 ? addToPlan : "none"} */}
                      {/* <InputLabel id="demo-multiple-name-label">Add to Plan</InputLabel>
                      <Select disabled={usergroup==="project manager" && taskInfo.Task_state==="open"?false:true} labelId="demo-multiple-name-label" id="demo-multiple-name" defaultValue={taskInfo.Task_plan? taskInfo.Task_plan : "none"} onChange={handlePlanChange} input={<OutlinedInput label="Add to Plan" />} MenuProps={MenuProps}>
                        <MenuItem key={"none"} value={"none"}>
                          None
                        </MenuItem>
                        {plans.map(plan => (
                          <MenuItem key={plan.Plan_MVP_name} value={plan.Plan_MVP_name}>
                            {plan.Plan_MVP_name}
                          </MenuItem>
                          
                          //<option value={plan}>{plan}</option>
                        ))}
                      </Select> */}
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="col-6 py-lg-3">
                <div className="form-group">
                  <label htmlFor="task-description">Task Description</label>
                  <textarea disabled defaultValue={taskInfo.Task_description} className="form-control" id="task-description" rows="5" onChange={handleTaskDescriptionChange}></textarea>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="task-note">Notes</label>
                  <textarea disabled value={taskInfo.Task_notes} className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
                </div>
                <div className="form-group">
                  {/* <label htmlFor="task-note">Notes</label>
                  <textarea disabled={taskInfo.Task_state === "open" && openRights.includes(usergroup)} className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea> */}
                  {textareastatus()}
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {savebutton(taskInfo)}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TaskinfoModal
