import React, { useState, useEffect ,  useContext } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Context
import AuthContext from "../context/authContext"
import ApplicationContext from "../context/appContext"

function NavBar(props) {

  const { auth, userRole, setUserRole,  thisUserID, setThisUserID , isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { setCurrApplication } = useContext(ApplicationContext);

  const [userData,  setUserData] = useState({});
  const [role, setrole] = useState("")
  useEffect(() => {
    let tokenn
    axios.post("http://localhost:3001/getdecode", { token: sessionStorage.getItem("token") }).then(res => {
      tokenn = res.data["username"]
      console.log(tokenn)
      axios.post("http://localhost:3001/checkgroup", { username: tokenn, group: "Admin" }).then(res => {
        setrole(res.data)
        console.log(res.data)
      })
    })
    
    
  }, [isLoggedIn])

  const doLogout  = () => {
    setrole("");
    sessionStorage.clear()
    setIsLoggedIn(false);
    window.location.replace("/")
   
  }


  const navIcon = () => {
    if(!isLoggedIn){
      //sessionStorage.clear()
      return(
        <h4 className="my-0 mr-md-auto font-weight-normal no-underline">
          <Link to="/" className="text-white">{" "}Kanban App{" "}</Link>
        </h4>
      )
    } else {
      return(
        <h4 className="my-0 mr-md-auto font-weight-normal no-underline">
          <Link to="/homepage" className="text-white">{" "}Kanban App{" "}</Link>
        </h4>
      )
    }
  }

  const authLink = () =>{
      if(role && isLoggedIn == true){
        return (
          <div>
            <ul className="nav">
              {/* <button onClick={getUserOfSpecificGroup}>
                Group
              </button> */}
              <li className="nav-item">
                <Link to="/board" className=" text-white navBarLink nav-link">{" "}Task Management{" "}</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className=" text-white navBarLink nav-link">{" "}Profile{" "}</Link>
              </li>
              <li className="nav-item">
                <Link to="/Admin" className="text-white navBarLink nav-link">{" "}Admin{" "}</Link>
              </li>
              
              <li className="nav-item">
                <Link to="/" className="text-white navBarLink nav-link" onClick={doLogout}>{" "}Logout</Link>
              </li>
            </ul>
          </div>
        ) 
      } else if(!role && isLoggedIn == true){
        return(
          <div>
            <ul className="nav">
            <li className="nav-item">
                <Link to="/board" className=" text-white navBarLink nav-link">{" "}Task Management{" "}</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="text-white navBarLink nav-link">{" "}Profile{" "}</Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="text-white navBarLink nav-link" onClick={doLogout}>{" "}Logout</Link>
              </li>
            </ul>
          </div>
        )
      
    }
  }
  
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        {navIcon()}
        {authLink()}
      </div>
    </header>
  )
}

export default NavBar