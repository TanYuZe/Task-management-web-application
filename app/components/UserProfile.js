import axios from "axios"
import React, { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import EditUser from "../components/EditUser"
import AuthContext from "../context/authContext"
import EditUserProfile from "./EditUserProfile"

function UserProfile() {
  const [userList, setUserList] = useState([])
  const [statusbutton, setstatusbutton] = useState("")
  const [user, setUser] = useState("")
  //const { username, email, password, status, group, Login, loginErr, thisUsername, userRole, setUserRole, isLoggedIn } = useContext(AuthContext)
  const { Login , loginErr, thisUsername, userRole, setUserRole, isLoggedIn} = useContext(AuthContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [group, setgroup] = useState("")
  const [userr, setuserr] = useState("")
  const [token, settoken] = useState("")
  const [role, setrole] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    let tokenn
    axios.post("http://localhost:3001/getdecode", { token: sessionStorage.getItem("token") }).then(res => {
      tokenn = res.data["username"]
      console.log(tokenn)
      axios.post("http://localhost:3001/checkgroup", { username: tokenn, group: "Admin" }).then(res => {
        setrole(res.data)
        console.log(res.data)
       
      
        // if(res.data!=="user")
        // {
        //   if(res.data!=="admin")
        //   {
        //   navigate("/unauthorized")}
        // }
      
      })
    })
  }, [isLoggedIn, sessionStorage.getItem("token")])
  const decode = () => {
    let token1
    axios.post("http://localhost:3001/getdecode", { token: sessionStorage.getItem("token") }).then(res => {
      settoken(res.data["username"])
      token1 = res.data.username
      return token1
    })
    
  }

  const fetchUser = () => {
    const token1 = decode()
    //axios.post("http://localhost:3001/getuser",{username:user}).then(res => res.json()).then(json => setUserList(json))
    axios.post("http://localhost:3001/getuser", { username: token }).then(res => {
      //setUserList(res.json())
      if(res.data[0])
      {
      
      setUsername(res.data[0].username)
      setEmail(res.data[0].email)
      setPassword(res.data[0].password)
      setStatus(res.data[0].status)
      setgroup(res.data[0].groupname)
      
      setUserList(res)
      }
    })
    // console.log(userr)
  }
  useEffect(() => {
    fetchUser()
    
  }, [thisUsername, token, userList])
  //

  const statusbtn = status => {}

  

  const onSelected = () => {
    console.log(userList)
    //console.log(token.toString())
  }
  
  return (
    <div>
      <div>
        <h1>User Profile</h1>
        <table className="UserTable">
          <thead>
            <tr>
              <th>Username </th>
              <th>email</th>
              <th>password</th>
              <th>group</th>
              <th>status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{username}</td>
              <td>{email}</td>
              <td></td>
              <td>{group}</td>
              <td>
                {" "}
                {status} <br />
              </td>
              <td>
              <EditUserProfile status={status} username ={username} email ={email} password ={password} group={group}/>
              
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* {selected ? <EditUser user={selectedUser} /> : <></>} */}
    </div>
  )
  }



export default UserProfile
