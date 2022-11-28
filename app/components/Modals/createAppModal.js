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

function CreateAppModal(props) {
  const {app} = props

  const [show, setShow]= useState(false)
  const handleClose = () => {
    setShow(false)
    console.log(permitCreate)
    
  }
  const handleShow = () => {setShow(true)
    setsuccessmsg("")
    setErrormsg("")
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
  const [permitCreate, setPermitCreate] = useState([]);
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

    if(appRNum <0 || appRNum % 1 !=0 || appRNum.includes(".") )
    {
      setErrormsg("Running number must be more than 0 and is a whole number")
      setsuccessmsg("")
    }
    else{
    axios.post('http://localhost:3001/createApp', {
      appAcronym: appAcronym,
      appDescription: appDescription,
      appRNum: appRNum,
      appStartDate: appStartDate,
      appEndDate: appEndDate,
      permitCreate:permitCreate,
      permitOpen:permitOpen,
      permitToDoList:permitToDoList,
      permitDoing:permitDoing,
      permitDone:permitDone
    }).then((res) => {if (res.data === "all fields need to be filled"){
      setErrormsg("all fields need to be filled");
      setsuccessmsg("")
    } else if (res.data === "duplicate name"){
      setErrormsg("duplicate name");
      setsuccessmsg("")
    } 
    else if (res.data === "success"){
      
      reloadForm();
      setsuccessmsg("success")
      setErrormsg("")
      //update(username);
    }
  
  })
    }
    
  
}

  const [application, setApplication] = useState('');

  const fetchgroups = () => {
    fetch("http://localhost:3001/grouplist")
      .then(res => res.json())
      .then(json => {
        setgrouplist(json)
        
      })
  }
  const func = (grouops) => {
    
    //let groupy = groups.length === 0 ? groups.split(",") : groups
    let groupy = groups.split(",")
    let arraygroup = []
    if (groupy.length != 0) {
      for (let i = 0; i < groupy.length; i++) {
        if (groupy[i] !== "") {
          arraygroup.push(groupy[i])
        }
      }
      setPreviousGroup(arraygroup)
    } else {
      setPreviousGroup([])
    }
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
    setPermitCreate([]);
    setPermitOpen([]);
    setPermitToDoList([]);
    setPermitDoing([]);
    setPermitDone([]);
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
    <Button onClick={clickEvent}>Create App</Button>

    <Modal show={show} onHide={handleClose} animation={false}
    >
        <Modal.Header closeButton>
          <Modal.Title>Create App </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          
              <form id="createAppForm" onSubmit={handleCreateAppSubmit} >
                <div className="form row">
                  {/* Left */}
                  <div className="col-6">
                    <div className="form-row py-lg-3">
                      <div className="col-6">
                        <label className="" htmlFor="app-acronym">Application Acronym</label>
                        <input required id="app-acronym" onChange={handleAcronymChange} type="text" className="form-control"/>
                      </div>
                      <div className="col-6">
                        <label className="" htmlFor="app-Rnumber">Running Number</label>
                        <input required id="app-Rnumber"  onChange={handleRnumChange} min="0" step="1" type="number" className="form-control"/>
                      </div>
                    </div>
                    
                      <div className="col-6">
                        <label className="" htmlFor="app-startDate">Start Date</label>
                        <input required id="app-startDate" onChange={handleStartDateChange} type="date" style={{width:"140px"}} className="form-control"/>
                      
                      </div>
                      <br/>
                      
                      <div className="col-6">
                        <label className="" htmlFor="app-endDate">End Date</label>
                        <input required id="app-endDate" onChange={handleEndDateChange} type="date" style={{width:"140px"}} className="form-control"/>
                      </div>
                    </div>
                  

                  {/* Right */}
                  <div className="col-6 py-lg-3">
                    <div className="form-group">
                      <label htmlFor="app-description">Description</label>
                      <textarea onChange={handleAppDescriptionChange} className="form-control" id="app-description" rows="9"></textarea>
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
                        
                        //style={{ITEM_HEIGHT : 48}}
                        //defaultValue={"Team Lead"}
                        value={permitCreate}
                        onChange={handleCreateChange}
                        input={<OutlinedInput label="Create" />}
                        renderValue={(selected) => selected.join(', ')}
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
                        multiple
                        value={permitOpen}
                        onChange={handleOpenChange}
                        input={<OutlinedInput label="Open" />}
                        renderValue={(selected) => selected.join(', ')}
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
                        multiple
                        value={permitToDoList}
                        onChange={handleToDoListChange}
                        input={<OutlinedInput label="To-Do" />}
                        renderValue={(selected) => selected.join(', ')}
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
                        multiple
                        value={permitDoing}
                        onChange={handleDoingChange}
                        input={<OutlinedInput label="Doing" />}
                        renderValue={(selected) => selected.join(', ')}
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
                        multiple
                        value={permitDone}
                        onChange={handleDoneChange}
                        input={<OutlinedInput label="Done" />}
                        renderValue={(selected) => selected.join(', ')}
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
          <Button variant="primary" onClick={handleCreateAppSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  )
}

export default CreateAppModal;