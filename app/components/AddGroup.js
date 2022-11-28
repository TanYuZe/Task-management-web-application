import React, { useState, useEffect } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Axios from "axios"

// hi
function AddGroup() {
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
    setErrormsg("")
  }
  const handleShow = () => setShow(true)

  const [group, setGroup] = useState("")
  const [errormsg, setErrormsg] = useState("")
  const [successmsg, setSuccessmsg] = useState("")
  const [grouplist, setgrouplist] = useState([])

  const addgroup = () => {
    Axios.post("http://localhost:3001/addgroup", {
      group: group.trim()
    }).then(res => {
      if(res.data == "Values Inserted")
      {
        setErrormsg("")
        setGroup("")
        setSuccessmsg(res.data)
      }
      else{
        setSuccessmsg("")
      setErrormsg(res.data)}
    })
  }
  const clickEvent = () => {
    addgroup()
    console.log(group)
  }

  return (
    <>
      <Button onClick={handleShow}>Add New Group</Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Please enter group name:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Enter Group Name:</label>{" "}
          <input
            type="text"
            name="fname"
            id="groupname"
            value={group}
            onChange={event => {
              setGroup(event.target.value)
            }}
          />
          {errormsg && <p style={{ color: "red" }}> {errormsg}</p>}
          {successmsg && <p style={{ color: "green" }}> {successmsg}</p>}
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={clickEvent}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddGroup
