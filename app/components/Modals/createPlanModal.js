import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//Context
import ApplicationContext from "../../context/appContext"

function CreatePlan(props) {
  const [show, setShow]= useState(false)
  const handleClose = () => {
    setShow(false)
    
  }
  const handleShow = () => {setShow(true)
  }
  const clickEvent = () => {
    handleShow()
  }

  const { update, app } = props;

  // const { currApplication } = useContext(ApplicationContext);
  // const application = currApplication;

  //Toast
  const notify = (status) => {
    
  }

  // const [application, setApplication] = React.useState('');
  const [planMVPName, setPlanMVPName] = useState("");
  const [planStartDate, setPlanStartDate] = useState("");
  const [planEndDate, setPlanEndDate] = useState("");
  const [msg, setmsg] = useState("")
  const [errormsg, setErrormsg] = useState("")
  const [successmsg, setsuccessmsg] = useState("")
//const [application, setApplication] = useState("app1")
  //Submit Create Plan
  async function handleCreatePlanSubmit(e) {
    e.preventDefault();
   
     axios.post('http://localhost:3001/createplan', {
      application: app,
      planMVPName: planMVPName,
      planStartDate: planStartDate,
      planEndDate: planEndDate
      }).then((res) => {if (res.data === "all fields need to entered"){
        setErrormsg("all fields need to entered");
      } else if (res.data === "duplicate name"){
        setErrormsg("plan exists");
        setsuccessmsg("")
      } else if (res.data === "success"){
        setsuccessmsg("success");
        setErrormsg("")
        reloadForm();
        //update();
      }
     
      })

    
  }

  const handlePlanMVPNameChange = (event) => {
    setPlanMVPName(event.target.value);
  };

  const handlePlanStartDateChange = (event) => {
    setPlanStartDate(event.target.value);
  };

  const handlePlanEndDateChange = (event) => {
    setPlanEndDate(event.target.value);
  };

  //reload form
  async function reloadForm(e) {
     document.getElementById("createPlanForm").reset();
    // document.getElementById("plan-name").focus();
    // setPlanMVPName("");
    // setPlanStartDate("");
    // setPlanEndDate("");
  }
  
  

  return (
    // Testing
    <>
    <Button onClick={clickEvent}>Create Plan</Button>

    <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create Plan </Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <form id="createPlanForm" autoComplete="off" onSubmit={handleCreatePlanSubmit}>
                <div className="form row">
                  {/* Left */}
                  <div className="col-12">
                    <div className="form-row py-lg-3">
                      <div className="col-12">
                        <label className="" htmlFor="plan-name">Plan MVP Name</label>
                        <input required id="plan-name" onChange={handlePlanMVPNameChange} type="text" className="form-control"/>
                      </div>
                    </div>
                    <div className="form-row py-lg-2">
                      <div className="col-6">
                        <label className="" htmlFor="app-startDate">Start Date</label>
                        <input required id="app-startDate" onChange={handlePlanStartDateChange} type="date" className="form-control"/>
                      </div>
                      <div className="col-6">
                        <label className="" htmlFor="app-endDate">End Date</label>
                        <input required id="app-endDate" onChange={handlePlanEndDateChange} type="date" className="form-control"/>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              {errormsg && <p style={{ color: "red" }}> {errormsg}</p>}{successmsg && <p style={{ color: "green" }}> {successmsg}</p>}
              </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreatePlanSubmit}>
            Create
          </Button>
          
        </Modal.Footer>
      </Modal>
      </>
  )
}

export default CreatePlan;