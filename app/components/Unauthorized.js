import React, { useContext, useEffect } from "react"
import Page from '../components/Page';
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext"
function Unauthorized() {
  const{isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
  let navigate = useNavigate();
  const goback= () =>
  { 
    sessionStorage.clear()
    setIsLoggedIn(false)
    window.location.replace("/")
  }
  return (
  
      <div className="align-items-center">
        <h1 className="display-3 display-3-center center_align">Unauthorized</h1>
        <button onClick={goback}>Click here to go back to homepage</button>
        {/* <p className="lead text-muted display-3-center">Please log in.</p> */}
      </div>
    
  )
}

export default Unauthorized