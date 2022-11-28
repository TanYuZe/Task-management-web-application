import React, { createContext, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
//import jwt_decode from "jwt-decode";

//Toast
import { ToastContainer, toast } from "react-toastify"
//import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext()


// export default AuthContext;

export const AuthProvider = ({ children, ...rest }) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [group, setgroup] = useState("")
  const [userList, setUserList] = useState([])
  
  const fetchUser = () => {
    //const token1 = decode()
    //axios.post("http://localhost:3001/getuser",{username:user}).then(res => res.json()).then(json => setUserList(json))
    axios.post("http://localhost:3001/getuser", { username: username }).then(res => {
      //setUserList(res.json())
      if(res.data[0])
      {
      
      //setUsername(res.data[0].username)
      //setEmail(res.data[0].email)
      //setPassword(res.data[0].password)
      setStatus(res.data[0].status)
      setgroup(res.data[0].groupname)
      console.log(status)
      
      setUserList(res)
      }
    })
    // console.log(userr)
  }


  //Toast
  const notify = status => {
    if (status === "warning") {
      toast.warn("Wrong username/password", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    } else if (status === "deactivated") {
      toast.warn("Something went wrong", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
    }
  }

  //Check admin
  const [userRole, setUserRole] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState("")
  const [auth, setAuth] = useState({})
  const [thisUserID, setThisUserID] = useState("")
  const [loginErr, setloginErr] = useState("")
  const [thisUsername, setThisUsername] = useState("")
  const [usergroup , setusergroup] = useState("")
  

  useEffect(() => {
    fetchUser()
    
  }, [])
  
  async function Login(username, password) {
    let responseAdmin = await axios.post("http://localhost:3001/checkgroup", { group: "Admin", username: username })
    let responseAuth = await axios.post("http://localhost:3001/login", { username: username, password: password })
    let responseusergrp = await axios.post("http://localhost:3001/getusergrp", { username: username })
    if (responseAuth.data.errors) {
      setloginErr("Invalid username/password")
      setIsLoggedIn(false)
    } else {
      let success = responseAuth.data.success
      if (success) {
        setUsername(username)
        setIsLoggedIn(true)
        console.log(responseAdmin.data)
        console.log(responseusergrp.data)
        setusergroup(responseusergrp.data)
        if(responseAdmin.data)
        {
          setUserRole("admin")
        }
        else
        {
          setUserRole("user")
        }
        
        
      }
      else{
        //setloginErr(responseAuth.data.error)
        alert("your username/password is wrong")
      } 
    }
  }

  

  return <AuthContext.Provider value={{usergroup, username, email, password, status, group, Login, auth, setAuth, thisUserID, setThisUserID, userRole, isLoggedIn, setIsLoggedIn, thisUsername }}>{children}</AuthContext.Provider>
}

export default AuthContext
