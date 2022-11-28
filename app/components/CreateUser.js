import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Axios from "axios"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
function CreateUser() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {setShow(true)
  seterrormsg("")};

  const [name, setName] = useState("")
  const [password, setPass] = useState("")
  const [email, setEmail] = useState("")
  const [group, setGroup] = useState("")
  const [grouplist,setgrouplist] =useState([])
  const [errormsg, seterrormsg] = useState("")
  const [successmsg, setsuccessrmsg] = useState("")
  const [userlist, setUserList] = useState([])
  const [previousGroup, setPreviousGroup] = useState([])
  const fetchgroups = () => {
    fetch("http://localhost:3001/grouplist")
      .then(res => res.json())
      .then(json => setgrouplist(json))
  }
  useEffect(() => {
    fetchgroups()
  }, [grouplist])
  
  useEffect(() => {
    
  }, [errormsg])

  const addUser = () => {
    Axios.post("http://localhost:3001/create", {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      group: previousGroup.join(",")
    }).then((res) => {
      if(res.data=="Values Inserted")
      {
        setName("")
        setPass("")
        setEmail("")
        setsuccessrmsg("value inserted")
        seterrormsg("")
      }
      else{
        seterrormsg(res.data)
      }
        console.log(res)
        //seterrormsg(res.data)
    })

  }
  //
  const func = () => {
    let groups = selectedUser.groupname
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
  const handleChange = event => {
    const {
      target: { value }
    } = event
    setPreviousGroup(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    )
  }
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  //
  const handleSubmit = () => {
    
    
    
    addUser()
  }

  return (
    <>
      <Button  onClick={handleShow}>
        Create New User
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Please Enter User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errormsg && <p style={{color: "red"}}> {errormsg}</p>}
          {successmsg && <p style={{color: "green"}}> {successmsg}</p>}
          <label>Name:</label>
        <input
          type="text"
          name='fname'
          value={name}
          onChange={event => {
            setName(event.target.value)
          }}
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={event => {
            setEmail(event.target.value)
          }}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={event => {
            setPass(event.target.value)
          }}
        />
        <br />
        <label>Group:</label>
        <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">Group</InputLabel>
            <Select labelId="demo-multiple-checkbox-label" id="demo-multiple-checkbox" multiple value={previousGroup} onChange={handleChange} input={<OutlinedInput label="Tag" />} renderValue={selected => selected.join(", ")} MenuProps={MenuProps}>
              {grouplist.map(name => (
                <MenuItem key={name.groupList} value={name.groupList}>
                  <Checkbox checked={previousGroup.indexOf(name.groupList) > -1} />
                  <ListItemText primary={name.groupList} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary"  onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}



export default CreateUser