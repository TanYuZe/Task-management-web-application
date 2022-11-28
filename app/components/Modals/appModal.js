import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { Dialog } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"


//Context
import ApplicationContext from "../../context/appContext"

function AppModal(props) {
  const {usergroup, createRights,openRights ,toDoListRights,doingRights, doneRights,app} = props
 
  const [show, setShow]= useState(false)
  const handleClose = () => {
    setsuccessmsg("")
    setShow(false)
    console.log(permitCreate)
    
  }
  const handleShow = () => {setShow(true)
    setsuccessmsg("")
    setErrormsg("")
    setAppAcronym(app[0].App_Acronym)
    setAppDescription(app[0].App_Description)
    setAppRNum(app[0].App_Rnumber)
    setAppStartDate(app[0].App_startDate)
    setAppEndDate(app[0].App_endDate)
    setPermitOpen(app[0].App_permit_Open.replaceAll('[', '').replaceAll(']', '').replaceAll('"',''))
    setPermitToDoList(app[0].App_permit_toDoList.replaceAll('[', '').replaceAll(']', '').replaceAll('"',''))
    setPermitDoing(app[0].App_permit_Doing.replaceAll('[', '').replaceAll(']', '').replaceAll('"',''))
    setPermitCreate(app[0].App_permit_Create.replaceAll('[', '').replaceAll(']', '').replaceAll('"',''))
    setPermitDone(app[0].App_permit_Done.replaceAll('[', '').replaceAll(']', '').replaceAll('"',''))
    setAppDescription(app[0].App_Description)
  }
  
  //const GroupsArray = ["Team Lead", "Project manager", "Team member"]
  const [errormsg, setErrormsg] = useState("")
  const [successmsg, setsuccessmsg] = useState("")
  const [grouplist, setgrouplist] = useState([])
  const [appAcronym, setAppAcronym] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [appRNum, setAppRNum] = useState("");
  const [appStartDate, setAppStartDate] = useState("");
  const [appEndDate, setAppEndDate] = useState("");
  const [permitCreate, setPermitCreate] = useState("");
  const [permitOpen, setPermitOpen] = useState([]);
  const [permitToDoList, setPermitToDoList] = useState([]);
  const [permitDoing, setPermitDoing] = useState([]);
  const [permitDone, setPermitDone] = useState([]);

  //Multi-Selector
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const clickEvent = () => {
    handleShow()
  }
  //Submit Create Application
  async function handleCreateAppSubmit(e) {
    e.preventDefault();
    axios.post("http://localhost:3001/updateapp", {
      appAcronym: appAcronym,
      permitCreate: permitCreate,
        permitOpen: permitOpen,
        permitToDoList: permitToDoList,
        permitDoing: permitDoing,
        permitDone : permitDone,
        description: appDescription,
        enddate: appEndDate,
        startdate: appStartDate
    }).then((res)=>{
      if(res.data == "no permit change")
      {
        setErrormsg("no permit change")
        setsuccessmsg("")
      }
      else if(res.data == "success")
      {
        setsuccessmsg("success")
        setErrormsg("")
      }
    })
  
}

  const [application, setApplication] = useState('');

  const fetchgroups = () => {
    fetch("http://localhost:3001/grouplist")
      .then(res => res.json())
      .then(json => {
        setgrouplist(json)
        
      })
  }
  
  useEffect(() => {
    fetchgroups()
  }, [show])
  const handleAcronymChange = (event) => {
    setAppAcronym(event.target.value);
  };

  const handleAppDescriptionChange = (event) => {
    setAppDescription(event.target.value);
  };

  const handleRnumChange = (event) => {
    setAppRNum(event.target.value);
  
  };

  const handleStartDateChange = (event) => {
    setAppStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setAppEndDate(event.target.value);
  };

  const handleCreateChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitCreate(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleOpenChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitOpen(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const handleToDoListChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitToDoList(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const handleDoingChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitDoing(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleDoneChange = (event) => {
    const {
      target: { value },
    } = event;

    setPermitDone(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  //reload form
  async function reloadForm(e) {
    // setPermitCreate([]);
    // setPermitOpen([]);
    // setPermitToDoList([]);
    // setPermitDoing([]);
    // setPermitDone([]);
    document.getElementById("createAppForm").reset();
    document.getElementById("app-acronym").focus();
  }
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};
  return (
    // Testing
    <>
    <Button onClick={clickEvent}>App information</Button>

    <Modal show={show} onHide={handleClose} animation={false}
    >
        <Modal.Header closeButton>
          <Modal.Title>{usergroup==="project lead"?"Edit App Information":"View App Information"}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          
              <form id="createAppForm" onSubmit={handleCreateAppSubmit} >
                <div className="form row">
                  {/* Left */}
                  <div className="col-6">
                    <div className="form-row py-lg-3">
                      <div className="col-6">
                        <label  className="" htmlFor="app-acronym">Application Acronym</label>
                        <input disabled required id="app-acronym" onChange={handleAcronymChange} type="text" className="form-control" value={appAcronym}/>
                      </div>
                      <div className="col-6">
                        <label className="" htmlFor="app-Rnumber">Running Number</label>
                        <input disabled required id="app-Rnumber"  onChange={handleRnumChange} min="0" step="1" type="number" className="form-control" value={appRNum}/>
                      </div>
                    </div>
                    
                      <div className="col-6">
                        <label className="" htmlFor="app-startDate">Start Date</label>
                        <input  disabled={!usergroup.includes("project lead")}required id="app-startDate" onChange={handleStartDateChange} type="date" style={{width:"140px"}} className="form-control" value={appStartDate}/>
                      
                      </div>
                      <br/>
                      
                      <div className="col-6">
                        <label className="" htmlFor="app-endDate">End Date</label>
                        <input  disabled={!usergroup.includes("project lead")} required id="app-endDate" onChange={handleEndDateChange} type="date" style={{width:"140px"}} className="form-control" value={appEndDate}/>
                      </div>
                    </div>
                  

                  {/* Right */}
                  <div className="col-6 py-lg-3">
                    <div className="form-group">
                      <label htmlFor="app-description">Description</label>
                      <textarea disabled={!usergroup.includes("project lead")} onChange={handleAppDescriptionChange} className="form-control" id="app-description" rows="9" value={appDescription}></textarea>
                    </div>
                  </div>
                </div>
                <br/>

                <div className="form-row">
                  <div className="col-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">Create</InputLabel>
                      <Dialog disableEnforceFocus></Dialog>
                      <Select 
                        required
                        //className="select-form"
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        disabled={!usergroup.includes("project lead")}
                        //style={{ITEM_HEIGHT : 48}}
                        //defaultValue={"Team Lead"}
                        value={permitCreate}
                        onChange={handleCreateChange}
                        input={<OutlinedInput label="Create" />}
                       
                        MenuProps={MenuProps}
                      >
                        {grouplist?.map((groups) => {
                          return(
                            <MenuItem key={groups.groupList} value={groups.groupList}>
                            <Checkbox checked={permitCreate.indexOf(groups.groupList) > -1} />
                            <ListItemText primary={groups.groupList} />
                            </MenuItem>
                          )
                        })}
                        </Select>
                    </FormControl>
                  </div>
                  <div className="col-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">Open</InputLabel>
                      <Dialog disableEnforceFocus></Dialog>
                      <Select
                        required 
                        className="select-form"
                        labelId="multiple-checkbox-label"
                        id="multiple-checkbox"
                        disabled={!usergroup.includes("project lead")}
                        
                        value={permitOpen}
                        onChange={handleOpenChange}
                        input={<OutlinedInput label="Open" />}
                        
                        MenuProps={MenuProps}
                      >
                        {grouplist.map((groups) => {
                          return(
                            <MenuItem key={groups.groupList} value={groups.groupList}>
                            <Checkbox checked={permitOpen.indexOf(groups.groupList) > -1} />
                            <ListItemText primary={groups.groupList} />
                            </MenuItem>
                            
                          )
                        })}
                        </Select>
                    </FormControl>
                  </div>
                  <div className="col-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">To-Do</InputLabel>
                      <Dialog disableEnforceFocus></Dialog>
                      <Select
                        required 
                        className="select-form"
                        labelId="multiple-checkbox-label"
                        id="multiple-checkbox"
                        disabled={!usergroup.includes("project lead")}
                        value={permitToDoList}
                        onChange={handleToDoListChange}
                        input={<OutlinedInput label="To-Do" />}
                        
                        MenuProps={MenuProps}
                      >
                        {grouplist.map((groups) => {
                          return(
                            <MenuItem key={groups.groupList} value={groups.groupList}>
                            <Checkbox checked={permitToDoList.indexOf(groups.groupList) > -1} />
                            <ListItemText primary={groups.groupList} />
                            </MenuItem>
                            
                          )
                        })}
                        
                        </Select>
                    </FormControl>
                  </div>
                </div>

                <div className="form-row py-md-4">
                  <div className="col-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">Doing</InputLabel>
                      <Dialog disableEnforceFocus></Dialog>
                      <Select
                        required 
                        className="select-form"
                        labelId="multiple-checkbox-label"
                        id="multiple-checkbox"
                        disabled={!usergroup.includes("project lead")}
                        value={permitDoing}
                        onChange={handleDoingChange}
                        input={<OutlinedInput label="Doing" />}
                        
                        MenuProps={MenuProps}
                      >
                
                        {grouplist.map((groups) => {
                          return(
                            <MenuItem key={groups.groupList} value={groups.groupList}>
                            <Checkbox checked={permitDoing.indexOf(groups.groupList) > -1} />
                            <ListItemText primary={groups.groupList} />
                            </MenuItem>
                            
                          )
                        })}
                        </Select>
                    </FormControl>
                  </div>
                  <div className="col-4">
                    <FormControl fullWidth>
                      <InputLabel id="demo-multiple-name-label">Done</InputLabel>
                      <Dialog disableEnforceFocus></Dialog>
                      <Select
                        required 
                        className="select-form"
                        labelId="multiple-checkbox-label"
                        id="multiple-checkbox"
                        disabled={!usergroup.includes("project lead")}
                        value={permitDone}
                        onChange={handleDoneChange}
                        input={<OutlinedInput label="Done" />}
                        
                        MenuProps={MenuProps}
                      >
                         {grouplist.map((groups) => {
                          return(
                            <MenuItem key={groups.groupList} value={groups.groupList}>
                            <Checkbox checked={permitDone.indexOf(groups.groupList) > -1} />
                            <ListItemText primary={groups.groupList} />
                            </MenuItem>
                            
                          )
                        })}
                        </Select>
                    </FormControl>
                  </div>
                </div>

              </form>
              {errormsg && <p style={{ color: "red" }}> {errormsg}</p>}{successmsg && <p style={{ color: "green" }}> {successmsg}</p>}
              
              </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button disabled={!usergroup.includes("project lead")}variant="primary" onClick={handleCreateAppSubmit}>
            update
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  )
}

export default AppModal;