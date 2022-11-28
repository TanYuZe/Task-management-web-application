import React, { useState, useEffect, useContext } from "react"

import TaskPanel from "./taskPanel"
import { Navigate, useNavigate } from "react-router-dom"
import TaskInfoModal from "./Modals/taskInfoModal"
import CreatePlan from "./Modals/createPlanModal"
import CreateAppModal from "./Modals/createAppModal"
import CreateTaskModal from "./Modals/createTaskModal"
import AppModal from "./Modals/appModal"
//Context
import AuthContext from "../context/authContext"
import axios from "axios"

function Board(props) {
  const navigate = useNavigate()
  const { tasks, update, accessRights, appData } = props
  const { usergroup, isLoggedIn } = useContext(AuthContext)
  //Rights
  const [createRights, setCreateRights] = useState([])
  const [openRights, setOpenRights] = useState([])
  const [toDoListRights, setToDoListRights] = useState([])
  const [doingRights, setDoingRights] = useState([])
  const [doneRights, setDoneRights] = useState([])

  //Tasks states
  const [openTasks, setOpenTasks] = useState([])
  const [toDoListTasks, setToDoListTasks] = useState([])
  const [doingTasks, setDoingTasks] = useState([])
  const [doneTasks, setDoneTasks] = useState([])
  const [closeTasks, setCloseTasks] = useState([])

  //Current Tasks
  const [displayedTasks, setDisplayedTasks] = useState([])

  //Current Task Info
  const [taskName, setTaskName] = useState("")
  const [taskPlan, setTaskPlan] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskNotes, setTaskNotes] = useState("")

  //Promote or Demote
  const [taskAction, setTaskAction] = useState("")

  //View Modal
  const [show, setShow] = useState(false)

  //Show task info modal
  const handleShowTaskInfo = (task, action) => {}
  //
  const [appdata, setappdata] = useState([])

  //
  const [arraygrp, setarraygrp] = useState([])
  const [grp, setgrp] = useState("All")
  const [grpS, setgrpS] = useState(false)
  const [username, setUsername] = useState("")  
  const [plans, setplans] = useState([])

  //fetch all task
  // useEffect(() => {
  //   axios.post('http://localhost:3001/getplans', {
  //     acronym:grp}).then((res) => {
        
  //       setplans(res.data)
  //       })
    
  // }, [grpS, grp])
  
  const [pln, setpln] = useState("All")
  const [plns, setplns] = useState(false)
  const [stDate, setstdate] = useState("")
  function planfilter(plans)
  {
    return(<><select
      onChange={e => {
        setpln(e.target.value)
        setplns(true)}}
    >
      <option value="All">All plans</option>
      {plans.map(plan => {
        return <option value={plan.Plan_MVP_name}>{plan.Plan_MVP_name}</option>
      })}
    </select></>)
  }
 
  useEffect(() => {
    axios.post('http://localhost:3001/getplans', {
      acronym:grp}).then((res) => {
        setplans(res.data)
        })
    axios.post("http://localhost:3001/gettask", {
        acronym: grp
      })
      .then(res => {
        //console.log(res.data)
        setDisplayedTasks(res.data)
      })
    //filter
    if(pln!=="All")
    {
      const openArr = displayedTasks.filter(tasks => {
        return tasks.Task_state === "open" && tasks.Task_plan=== pln
      })
      setOpenTasks(openArr)
      const toDoListArr = displayedTasks.filter(tasks => {
        return tasks.Task_state === "toDoList" && tasks.Task_plan === pln
      })
      setToDoListTasks(toDoListArr)
      const doingArr = displayedTasks.filter(tasks => {
        return tasks.Task_state === "doing" && tasks.Task_plan === pln
      })
      setDoingTasks(doingArr)
      const doneArr = displayedTasks.filter(tasks => {
        return tasks.Task_state === "done" && tasks.Task_plan === pln
      })
      setDoneTasks(doneArr)
      const closeArr = displayedTasks.filter(tasks => {
        return tasks.Task_state === "close" && tasks.Task_plan === pln
      })
      setCloseTasks(closeArr)
      const startdate = plans.filter(plan =>{
        return plan.Plan_MVP_name === pln
      })
      setstdate(startdate)
    }
    
    else
    {
    const openArr = displayedTasks.filter(tasks => {
      return tasks.Task_state === "open"
    })
    setOpenTasks(openArr)
    const toDoListArr = displayedTasks.filter(tasks => {
      return tasks.Task_state === "toDoList"
    })
    setToDoListTasks(toDoListArr)
    const doingArr = displayedTasks.filter(tasks => {
      return tasks.Task_state === "doing"
    })
    setDoingTasks(doingArr)
    const doneArr = displayedTasks.filter(tasks => {
      return tasks.Task_state === "done"
    })
    setDoneTasks(doneArr)
    const closeArr = displayedTasks.filter(tasks => {
      return tasks.Task_state === "close"
    })
    setCloseTasks(closeArr)
  }
  }, [grp, displayedTasks, isLoggedIn])
  //
  useEffect(() => {
    let tokenn

    axios.post("http://localhost:3001/getdecode", { token: sessionStorage.getItem("token") }).then(
      res => {
        tokenn = res.data["username"]
        setUsername(tokenn)
      },
      [isLoggedIn]
    )
    //
    
    if (grp !== "All") {
      axios.post("http://localhost:3001/getoneapp", { acronym: grp }).then(res => {
        
        setappdata(res.data)
        setCreateRights(res.data[0].App_permit_Create)

        setOpenRights(res.data[0].App_permit_Open)
        setToDoListRights(res.data[0].App_permit_toDoList)
        setDoingRights(res.data[0].App_permit_Doing)
        setDoneRights(res.data[0].App_permit_Done)

        //setCloseTasks(res.data.App_permit_Create)
      })
    }
  }, [grp, appdata])
  
  useEffect(() => {
    getapp()
    if (!grpS) {
      setgrp("All")
    }
  }, [arraygrp])
  //
  useEffect(() => {
    getapp()
  }, [])
  const getapp = () => {
    axios.post("http://localhost:3001/getAppsname", {}).then(res => {
      //console.log(res.data)
      let array1 = []
      // console.log(res.data)
      for (let i = 0; i < res.data.length; i++) {
        array1.push(res.data[i].App_Acronym)
      }
      //console.log(array1)
      setarraygrp(array1)
    })
  }

  //Rights (updates when task changes)
  function buttonfunc() {
    if (usergroup.includes("project lead") || createRights.includes(usergroup)) {
    
      if (grp == "All") {
        return (
          <>
            <CreateAppModal />
          </>
        )
      } else {
        return (
          <>
            <CreateAppModal />{" "}
            <CreateTaskModal app={grp} username={username} />{" "}
          </>
        )
      }
      
     
    }

    // if(createRights.includes(usergroup))
    // {
    //   return (<>
    //     <CreateTaskModal app={grp} username={username}/></>)
    // }
    
  }
  function planbutton()
  {
    if (openRights.includes(usergroup)) {
      if (grp !== "All") {
        return (
          <>
            <CreatePlan app={grp} />
          </>
        )
      }
    }
  }
  
  function appedit()
  {
    if(grp !=="All")
    {
      
      return (<><AppModal usergroup={usergroup} app={appdata} createRights={createRights} openRights={openRights} toDoListRights={toDoListRights} doingRights={doingRights} doneRights={doneRights}/></>)
    }
  
  }

  return (
    <div>
      <h4>username:{username}</h4>
      {buttonfunc()}
      {appedit()}
      {" "}
      {planbutton()}
      <br />
      <label>Select Application: </label>
      <select
        onChange={e => {
          setgrp(e.target.value)
          setgrpS(true)
        }}
      >
        <option value="All">Please select Application</option>
        {arraygrp.map(groups => {
          return <option value={groups}>{groups}</option>
        })}
      </select>
      {planfilter(plans)}
      
      {/* <CreatePlan app={grp}/> */}

      {/* <CreateTaskModal app={grp} username={username}/> */}
      {/* Open */}
      
      <table className="tableBoard" style={{ width: "1500px", border: "1px solid black" }}>
        <thead>
          <th>Open</th>
          <th style={{ width: "1500px" }}>to-do</th>
          <th style={{ width: "1500px" }}>Doing</th>
          <th style={{ width: "1500px" }}>Done</th>
          <th style={{ width: "1500px" }}>Close</th>
        </thead>
        <tr>
          <td style={{ width: "1500px" }}>
            <TaskPanel app={grp} appdata={appdata} displayedTasks={openTasks} username={username} createRights={createRights} openRights={openRights} toDoListRights={toDoListRights} doingRights={doingRights} doneRights={doneRights} />
          </td>
          <td style={{ width: "1500px" }}>
            <TaskPanel app={grp} appdata={appdata} displayedTasks={toDoListTasks} username={username} createRights={createRights} openRights={openRights} toDoListRights={toDoListRights} doingRights={doingRights} doneRights={doneRights} />
          </td>
          <td style={{ width: "1500px" }}>
            <TaskPanel app={grp} appdata={appdata} displayedTasks={doingTasks} username={username} createRights={createRights} openRights={openRights} toDoListRights={toDoListRights} doingRights={doingRights} doneRights={doneRights} />
          </td>
          <td style={{ width: "1500px" }}>
            <TaskPanel app={grp} appdata={appdata} displayedTasks={doneTasks} username={username} createRights={createRights} openRights={openRights} toDoListRights={toDoListRights} doingRights={doingRights} doneRights={doneRights} />
          </td>
          <td style={{ width: "1500px" }}>
            <TaskPanel app={grp} appdata={appdata} displayedTasks={closeTasks} username={username} createRights={createRights} openRights={openRights} toDoListRights={toDoListRights} doingRights={doingRights} doneRights={doneRights} />
          </td>
        </tr>
      </table>

      {/* To-do */}

      {/* Doing */}

      {/* Done */}

      {/* Close */}

      {/* Modals */}
    </div>
  )
}

export default Board
