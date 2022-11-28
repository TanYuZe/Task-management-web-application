import React, { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Axios from "axios"


function EditUserProfile({status, username, email, password, group}) {

  const [show, setShow]= useState(false)

  const handleClose = () => {
    setShow(false)
    console.log(InputPass)
  }
  const handleShow = () => {setShow(true)
  setErrormsg("")
setsuccessmsg("")}

  

  const [emailstatus, setEmailStatus] = useState(false)
  const [passwordstatus, setPassStatus] = useState(false)
  const [InputEmail , setEmail] = useState("")
  const [InputPass, setPass] = useState("")
  const [errormsg, setErrormsg] = useState("")
  const [successmsg, setsuccessmsg] = useState("")

  
  const updateInfo = () => {

    Axios.post("http://localhost:3001/updateinfo", {
      name: username.trim(),
      email: InputEmail.trim(),
      password: InputPass.trim(),
      group: group.trim(),
      status: status.trim()
    }).then((res) =>{setErrormsg(res.data)
    setEmail(email)
  setPass(password)} )
  }
  
  
  useEffect(() => {
    if (!emailstatus) {
      setEmail(email)
    }
    
    
  }, [show])

  const clickEvent = () => {
    handleShow()
    if (!emailstatus) {
      setEmail(email)
    }
    if (!passwordstatus) {
      setPass("")
    }
  }

  

  const submit = () => {
    if(!emailstatus && !passwordstatus)
    {
      setErrormsg("nothing is changed")
    }
    else
    {
      updateInfo()
    }
    
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
          <label>{username}</label>
          <br />
          <label>Email:</label>
          {"        "}
          <input
            type="text"
            id="email"
            defaultValue={email}
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
          <label>{status}</label>
          <br />
          <label>Group:</label>
          {"        "}
          <label>{group}</label>
          
          {errormsg && <p style={{ color: "red" }}> {errormsg}</p>} {successmsg && <p style={{ color: "green" }}> {successmsg}</p>}
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

export default EditUserProfile