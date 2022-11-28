import React from "react"
import { useContext, useState, useEffect } from "react"
import Axios from "axios"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import CreateUser from "./CreateUser"
import EditUser from "../components/EditUser"
import AddGroup from "../components/AddGroup"
import AuthContext from "../context/authContext"
import { Navigate, useNavigate } from "react-router-dom"


function Admin() {
  const [userList, setUserList] = useState([])
  const { Login , loginErr,  userRole, setUserRole, isLoggedIn} = useContext(AuthContext)
  const [role, setrole] = useState("")
  const navigate = useNavigate()

  const fetchUser = () => {
    fetch("http://localhost:3001/users")
      .then(res => res.json())
      .then(json => setUserList(json))
  }
  useEffect(() => {
    let tokenn
    Axios.post("http://localhost:3001/getdecode", { token: sessionStorage.getItem("token") }).then(res => {
      tokenn = res.data["username"]
      //console.log(tokenn)
      Axios.post("http://localhost:3001/checkgroup", { username: tokenn, group: "Admin" }).then(res => {
        setrole(res.data)
        //console.log(res.data)
      })
    })
    
    if(role == "user")
    {
      navigate("/unauthorized")
    }
    
    fetchUser()
  }, [userList])
  
 

  function onSelect(user) {
    var selected = true
    console.log(user)
    setSelectedUser(user)
  }
  return (
    <div>
      <div>
        <h1>User Management System</h1>
        <table className="UserTable">
          <thead>
            <tr>
              <th>Username </th>
              <th>email</th>
              <th>password</th>
              <th>group</th>
              <th>status</th>
              <th>
                <CreateUser /> <AddGroup />
                
              </th>
            </tr>
          </thead>
          <tbody>
            {userList.map(user => (
              <tr>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td></td>
                <td>{user.groupname}</td>
                <td>
                  {user.status} <br/>
                </td>
                <td>
                  {/* <button onClick={() => onSelect(user) }>Edit</button>{" "} */}
                  <EditUser selectedUser={user} /> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      {/* {selected ? <EditUser user={selectedUser} /> : <></>} */}
    </div>
    
  )
}

export default Admin
