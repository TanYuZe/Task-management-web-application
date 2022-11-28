import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Page from "../components/Page"
import axios from "axios"

//Context
import AuthContext from "../context/authContext"
import ApplicationContext from "../context/appContext"

function Login() {
  const { Login , loginErr,  userRole, setUserRole, isLoggedIn,setIsLoggedIn, thisUsername} = useContext(AuthContext)
  const { currentAppID, setCurrentAppID, GroupsArray, setGroupsArray } = useContext(ApplicationContext)
  const [sess, setsess] = useState("")

  let navigate = useNavigate()

  //Redirect if user is logged in
  // useEffect(() => {
  //  window.location.replace("/")
  // }, [])

  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState("")
  const [errmsg, seterrmsg] = useState("")
  const [status, setstatus] = useState("")
 
  const[AdminIs, setIsAdmin] = useState(false)
  //useEffect(() => {if(isLoggedIn){loginadmin(username)}}, [username])
  // function statusfunc()
  // {
  //   axios.post("http://localhost:3001/getstatus", 
  //   {username: username }).then((res)=>
  //   {
  //     if(res.data.Status=="active")
  //     {
  //       setstatus("active")
  //     }
  //     else
  //     {
  //       setstatus("false")
  //     }
  //   })
  // }
  // function loginadmin(username)
  // {
  //   axios.post("http://localhost:3001/checkgroup", 
  //   { group: "Admin", username: username }).then((res)=>
  //   {
  //     setIsAdmin(res.data.isAdmin)
  //     if(res.data.isAdmin)
  //     {
  //       //sessionStorage.setItem("role", "admin")
  //       return true
        
  //     }
  //     else{
  //      // sessionStorage.setItem("role", "user")
  //       return false
  //     }
  //   })

  //}
   async function LoginFunc(username, password) {
    let responseStatus = await axios.post("http://localhost:3001/getstatus", { username: username})
    axios.post("http://localhost:3001/login", { username: username, password: password }).then( async (res) =>{
    //console.log(responseStatus.data.Status)
    //  if(responseStatus.data.Status == "active")
    //  {
    if(res.data.success)
    {
      if(responseStatus.data.Status == "active")
     {
      sessionStorage.setItem("token", res.data.token)
      setIsLoggedIn(res.data.success)
      await Login(username, password)
      navigate("/board")
     }
     else
     {
      seterrmsg("account disabled")
     }
      
      
    }
    else if(res.data.token == "")
    {
      //seterrmsg("account is disabled")
      navigate("/unauthorized")
      return false
    }
    else{
      seterrmsg(res.data.error)
      
    }
  }
  // else
  // {
  //   seterrmsg("wrong username/password ")
  // }

  //  }
    )    
    
    }
   
function handleSubmit(e) {
  e.preventDefault()
  LoginFunc(username,password)
}


  return (
    <Page title="Login">
      <div className="align-items-center">
        <h1 className="display-3 display-3-center center_align">Login</h1>
        <p className="lead text-muted display-3-center"></p>
        <div className="col-lg-4 py-lg-5 center_align">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                required
                id="username"
                name="username"
                className="form-control"
                type="text"
                autoComplete="off"
                placeholder="Username"
                onChange={e => {
                  setUsername(e.target.value)
                }}
              />
            </div>

            <div className="form-group">
              <input
                required
                id="password-login"
                name="password"
                className="form-control"
                type="password"
                placeholder="Password"
                onChange={e => {
                  setPassword(e.target.value)
                }}
              />
            </div>

            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
              {" "}
              Login
            </button>
            {errmsg && <p> {errmsg}</p>}
          </form>
        </div>
      </div>
      {/* <div className="display-3-center center_align">
        <p>Lead: admin </p>
        <p>Project Lead: dev1 </p>
        <p>Project Manager: dev2 </p>
        <p>Team Member: dev3</p>
      </div> */}
    </Page>
  )
}

export default Login
