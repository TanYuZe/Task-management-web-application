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

function CreateTaskModal(props) {
  //const {username} = useContext(AuthContext)
  const {app, username} = props
  const [taskName, setTaskName] = useState("")
  const [addToPlan, setAddToPlan] = useState([])
  const [taskDescription, setTaskDescription] = useState("")
  const [taskNote, setTaskNote] = useState("")
   const [errormsg, setErrormsg] = useState("")
  const [successmsg, setsuccessmsg] = useState("")
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
    axios.post('http://localhost:3001/getplans', {
      acronym:app}).then((res) => {
        //console.log(res.data[0].Plan_MVP_name)
        setplans(res.data)
        })
  }
  useEffect(() => {
    axios.post('http://localhost:3001/getplans', {
      acronym:app}).then((res) => {
        
        setplans(res.data)
        })

    
  }, [plans])
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
    if(app != "All")
    {

    
    axios.post('http://localhost:3001/createTask', {
      application: app,
        taskName: taskName,
        addToPlan: addToPlan,
        taskDescription: taskDescription,
        taskNote: taskNote,
        username: username
      }).then((res) => {
        if(res.data === "task exists")
        {
          setErrormsg("task exists")
          setsuccessmsg("")
        }
        else if(taskName === "")
        {
          setErrormsg("task name cannot be empty")
        }
        else if(res.data === "success")
        {
          setsuccessmsg("success")
          setErrormsg("")
        }
        console.log(res.data)
        })
       // console.log("taskmodal:changes saved")
        axios.post('http://localhost:3001/getplans', {
      acronym:app}).then((res) => {
        console.log(res.data)
        setplans(res.data)
        })
        //console.log("hello")

      }
    // let username = await JSON.parse(sessionStorage.getItem("user")).username
    // // console.log(application,taskName,addToPlan,taskDescription,taskNote,username)

    // try {
    //   const response = await axios.post("/apps/tasks/create", {
    //     application,
    //     taskName,
    //     addToPlan,
    //     taskDescription,
    //     taskNote,
    //     username
    //   })

    //   // console.log(response.data);

    //   if (response.data === "task exists") {
    //     notify("task exists")
    //   } else if (response.data === "no task name") {
    //     notify("no task name")
    //     document.getElementById("task-name").focus()
    //   } else if (response.data === "success") {
    //     notify("success")
    //     reloadForm()
    //     updateTasks()
    //   }
    // } catch {
    //   notify("warning")
    // }
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

  return (
    // Testing
    <>
      <Button onClick={clickEvent}>Create Task</Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task </Modal.Title>
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
                    <input required id="task-name" type="text" className="form-control" onChange={handleTaskNameChange} />
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
                      <InputLabel id="demo-multiple-name-label">Add to Plan</InputLabel>
                      <Select labelId="demo-multiple-name-label" id="demo-multiple-name" value={addToPlan.length !== 0 ? addToPlan : "none"} onChange={handlePlanChange} input={<OutlinedInput label="Add to Plan" />} MenuProps={MenuProps}>
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
                    </FormControl>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="col-6 py-lg-3">
                <div className="form-group">
                  <label htmlFor="task-description">Task Description</label>
                  <textarea className="form-control" id="task-description" rows="5" onChange={handleTaskDescriptionChange}></textarea>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="task-note">Notes</label>
                  <textarea className="form-control" id="task-note" rows="5" onChange={handleTaskNoteChange}></textarea>
                </div>

                {/* <div className="accordion accordion-flush" id="accordionFlushExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-headingOne">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Task Notes
                          </button>
                        </h2>
                        <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                          <div className="accordion-body">
                            <textarea className="form-control" id="app-description" rows="5" defaultValue="Hello" disabled></textarea>
                          </div>
                        </div>
                      </div>
                    </div> */}
              </div>
            </div>
          </form>
          {errormsg && <p style={{ color: "red" }}> {errormsg}</p>}{successmsg && <p style={{ color: "green" }}> {successmsg}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateTaskSubmit}>Create</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreateTaskModal
