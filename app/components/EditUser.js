import React, { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Axios from "axios"

import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
const EditUser = ({ selectedUser }) => {

  const [show, setShow] = useState(false)

  const handleClose = () => {
    console.log(selectedGroups)
    console.log(JSON.stringify(selectedUser.groupname))
    console.log(previousGroup)
    setShow(false)
  }
  const handleShow = () => {setShow(true)
  setErrormsg("")
setsuccessmsg("")}

  const [password, setPass] = useState("")
  const [email, setEmail] = useState("")
  const [selectedGroups, setSelectedGroups] = useState([]) //checkbox selected data
  const [newgroup, setnewgroup] = useState("")
  const [userList, setUserList] = useState([])
  const [grouplist, setgrouplist] = useState([]) //store fetch data

  const [status, setStatus] = useState("")
  const [emailstatus, setEmailStatus] = useState(false)
  const [passwordstatus, setPassStatus] = useState(false)
  const [statuss, setStatuss] = useState(false)
  const [oppstatus, setoppstatus] = useState("")
  const [previousGroup, setPreviousGroup] = useState([])
  const [errormsg, setErrormsg] = useState("")
  const [successmsg, setsuccessmsg] = useState("")
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


  const fetchgroups = () => {
    fetch("http://localhost:3001/grouplist")
      .then(res => res.json())
      .then(json => {
        setgrouplist(json)
        
      })
  }
  //
  useEffect(() => {
    fetchgroups()
    func()
    if (!emailstatus) {
      setEmail(selectedUser.email)
    }
    // if (!passwordstatus) {
    //   setPass(selectedUser.password)
    // }
    if (!statuss) {
      setStatus(selectedUser.status)
    }
    //
    if (selectedUser.status == "active") {
      setoppstatus("disabled")
    } else if (selectedUser.status == "disabled") {
      setoppstatus("active")
    }
  }, [show])

  const clickEvent = () => {
    handleShow()
  }

  const updateInfo = () => {
    var strgroup = previousGroup.join(",")

    Axios.post("http://localhost:3001/updateinfo", {
      name: selectedUser.username,
      email: email.trim(),
      password: password.trim(),
      group: strgroup.trim(),
      status: status.trim()
    }).then((res) => {
      if(res.data == "User updated ")
      {
        setsuccessmsg("Values Inserted")
        setErrormsg("")
      }
      else{

      setsuccessmsg("")
      setErrormsg(res.data)
      }
    })
  }
  //

  const submit = () => {
    updateInfo()
  }

  /////////////
  return (
    <>
      <Button onClick={clickEvent}>Edit User</Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Please Edit User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Name:</label>
          {"        "}
          <label>{selectedUser.username}</label>
          <br />
          <label>Email:</label>
          {"        "}
          <input
            type="text"
            id="email"
            defaultValue={selectedUser.email}
            onChange={event => {
              setEmail(event.target.value)
              setEmailStatus(true)
            }}
          />
          <br />
          <label>Password:</label>
          {"        "}
          <input
            type="password"
            id="password"
            onChange={event => {
              setPass(event.target.value)
              setPassStatus(true)
            }}
          />
          <br />
          <label>Status:</label>{" "}
          <select
            defaultvalue={selectedUser.status}
            onChange={e => {
              setStatus(e.target.value)
              setStatuss(true)
            }}
          >
            <option value={selectedUser.status}>{selectedUser.status}</option>
            <option value={oppstatus}>{oppstatus}</option>
          </select>
          <br />
          <label>Group:</label>
          {"        "}
          <label></label>
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
          {errormsg && <p style={{ color: "red" }}> {errormsg}</p>}{successmsg && <p style={{ color: "green" }}> {successmsg}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={submit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EditUser
