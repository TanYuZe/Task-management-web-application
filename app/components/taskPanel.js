import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import ApplicationContext from "../context/appContext"
import TaskinfoModal from "./Modals/taskInfoModal"
import CreatePlan from "./Modals/createPlanModal";
import AuthContext from "../context/authContext";
//Context

function TaskPanel(props) {
  const { createRights,openRights ,toDoListRights,doingRights, doneRights, updateTasks, taskState, handleShowModal, displayedTasks, rights, username, app, appdata } = props
  const {usergroup} = useContext(AuthContext)
//const { tasks} = useContext(ApplicationContext)
  // document.getElementById("helloHello").style.backgroundColor = "lightblue";
  const [email, setemail] = useState([])
  // useEffect(() => {
  //   axios.post("http://localhost:3001/getPlanInfo"),
  //   {
  //     plan_MVP_name : task.Task_plan,
  //     appAcronym : app
  //   }.then((res)=>{

  //     setPlans(res.data)
  //   })
  // }, [task.Task_plan])
  //
  
  async function promotetask(task) {
    axios.post("http://localhost:3001/movetaskstate", {
      username: username,
      updatetype: "promote",
      taskInfo: task
    })
    if(task.Task_state == "doing")
    {
      sendemail(task)
    }
    
  }
  async function demotetask(task) {
    // axios.post("http://localhost:3001/movetask", {
    //   username: username,
    //   application: app,
    //   updatetype: "promote",
    //   currentState: task.Task_state,
    //   taskID: task.Task_id,
    //   taskName: task.Task_name,
    //   addToPlan: task.Task_plan,
    //   taskDescription: task.Task_description,
    //   taskNote: task.Task_notes
    // })
    axios.post("http://localhost:3001/movetaskstate", {
      username: username,
      updatetype: "demote",
      taskInfo: task
    })
  }
function sendemail(task)
{
  axios.post("http://localhost:3001/senddonetaskemail", {
    username: username,
    taskInfo: task,
    application: app,
    donerights:doneRights
  })
}
  function promotebtn(task)
  {
    //open
    if(task.Task_state==="open" &&  openRights.includes(usergroup))
    {
      return ( <> <button disabled={
        task.Task_state==="close"
          ?true:false
      } type="button" onClick={() => promotetask(task)} className="btn-arrow btn-align-right">
      promote
    </button> </>)
    }
    //todo
    if(task.Task_state==="toDoList" &&  toDoListRights.includes(usergroup))
    {
      return ( <> <button disabled={
        task.Task_state==="close"
          ?true:false
      } type="button" onClick={() => promotetask(task)} className="btn-arrow btn-align-right">
      promote
    </button> 
    </>)
    }

  //   if(task.Task_state==="toDoList" &&  openRights.includes(usergroup))
  //   {
  //     return ( <> 
  //   <button disabled={
  //     task.Task_state==="open"
  //       ?true:false
  //   } type="button" onClick={() => demotetask(task)} className="btn-arrow">
  //   demote
  // </button></>)
  //   }
    //doing
    if(task.Task_state==="doing" &&  doingRights.includes(usergroup))
    {
      return ( <> <button disabled={
        task.Task_state==="close"
          ?true:false
      } type="button" onClick={() => promotetask(task)} className="btn-arrow btn-align-right">
      promote
    </button> 
    <button disabled={
      task.Task_state==="open"
        ?true:false
    } type="button" onClick={() => demotetask(task)} className="btn-arrow">
    demote
  </button>
    </>)
    }
    //done
    if(task.Task_state==="done" &&  doneRights.includes(usergroup))
    {
      return ( <> <button disabled={
        task.Task_state==="close"
          ?true:false
      } type="button" onClick={() => promotetask(task)} className="btn-arrow btn-align-right">
      promote
    </button> 
    <button disabled={
      task.Task_state==="open"
        ?true:false
    } type="button" onClick={() => demotetask(task)} className="btn-arrow">
    demote
  </button></>)
    }
  //   if(task.Task_state==="done" &&  usergroup.includes("team member"))
  //   {
  //     return ( <> 
  //   <button disabled={
  //     task.Task_state==="open"
  //       ?true:false
  //   } type="button" onClick={() => demotetask(task)} className="btn-arrow">
  //   demote
  // </button></>)
  //   }
    //close
  //   if(task.Task_state==="close" &&  doneRights.includes(usergroup))
  //   {
  //     return ( <> 
  //   <button disabled={
  //     task.Task_state==="open"
  //       ?true:false
  //   } type="button" onClick={() => demotetask(task)} className="btn-arrow">
  //   demote
  // </button></>)
  //   }

    


  }


  // function demotebtn(task)
  // {

  //   return ( <> <button disabled={
  //     task.Task_state==="open"
  //       ?true:false
  //   } type="button" onClick={() => demotetask(task)} className="btn-arrow">
  //   demote
  // </button> </>)



  // }
  const color = "white"
  return (
    <div>
      {displayedTasks.map(task => (
        <div className="task-panel" >
          <div className="task-div" style={{ backgroundColor: color }}>
            {/* <button id={task.task_id} type="button" className="task-button" data-bs-toggle="modal" data-bs-target="#taskInfoModal"> */}

            <div className="top-section doFlex">
              <div id="task-colour" className="indicate-colour" ></div>
              <div className="task-info">
              <h4 className="task-name">Task :{task.Task_name}</h4>
                <p className="task-owner-name">Owner: {task.Task_owner}</p>
                <p className="plan-name">Plan: {task.Task_plan}</p>
                
                {/* <p className="task-panel-description">Description: {task.Task_description}</p> */}
                
                {promotebtn(task)}
            
           
            <TaskinfoModal taskInfo={task} app={app} username={username} usergroup={usergroup} createRights={createRights} 
            openRights = {openRights} toDoListRights = {toDoListRights} doingRights={doingRights} doneRights={doneRights}/>
              </div>
            </div>
          </div>
          <div className="task-navigation">
            {/* Left button */}
            
          </div>
        </div>
      ))}
    </div>
  )

  // <div>
  //   <div className="task-panel">
  //     <button type="button" className="task-button" data-bs-toggle="modal" data-bs-target="#taskInfoModal">
  //       <div className="top-section doFlex">
  //         <div id="helloHello" className="indicate-colour"></div>
  //         <div className="task-info">
  //           <p className="task-owner-name">Owner: XXXX</p>
  //           <p>Sprint 1</p>
  //           <h4>Task</h4>
  //           <p>Description...</p>
  //         </div>
  //       </div>
  //     </button>
  //     <div className="task-navigation">

  //       {/* Left button */}
  //       <button type="button" className="btn-arrow">
  //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
  //           <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
  //         </svg>
  //       </button>

  //       {/* Right Button */}
  //       <button type="button" className="btn-arrow btn-align-right">
  //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
  //           <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
  //         </svg>
  //       </button>
  //     </div>
  //   </div>
  // </div>
}

export default TaskPanel
