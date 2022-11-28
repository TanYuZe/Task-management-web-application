import { Navigate } from "react-router-dom"
import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import AuthContext from "../context/authContext"
const Protected = ({ allowedRoles, children }) => {
  const [username, setusername] = useState("")
  const [token, settoken] = useState("")
  const [role, setrole] = useState("")
  const [admin, setadmin] = useState(false)
  const [user, setuser] = useState(false)

  const {userRole, setUserRole, setIsLoggedIn, isLoggedIn} = useContext(AuthContext)
  
      useEffect(() => {
        var tokenn
        axios.post("http://localhost:3001/getdecode", { token: sessionStorage.getItem("token") }).then(res => {
          tokenn = res.data["username"]
         
          })
          axios.post("http://localhost:3001/checkgroup", { username:tokenn, group:"Admin" }).then(res => {
          
            setuser(res.data)
            console.log(res.data)
            })
          
         
      }, [username, isLoggedIn])
      
  if (allowedRoles.includes(userRole)) {
    return children
  }
  else{
    //sessionStorage.clear()
    return <Navigate to="/unauthorized" replace />
    setIsLoggedIn(false)
  }
}
export default Protected
