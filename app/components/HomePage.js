import React, { useContext, useEffect } from "react"
import Page from '../components/Page';
import { Link } from 'react-router-dom';
import AuthContext from "../context/authContext";

function HomePage() {
    const { username, auth, userRole, setUserRole,  thisUserID, setThisUserID , isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const authLink = () =>{
        if(isLoggedIn==false){
          return (
            <div>
              <Link to="/" className="text-white navBarLink nav-link">{" "}Login</Link>
            </div>
          )
        } else {
            return (
              <div>
                <h1> Welcome back {username} !!!</h1>
              </div>
            ) 
          // console.log(userData.role)
          // if(sessionStorage.getItem("role") === "admin"){
          //   return (
          //     <div>
          //       <h1>Admin homepage</h1>
          //     </div>
          //   ) 
          // } else {
          //   return(
          //     <div>
          //       <h1> user homepage</h1>
          //     </div>
          //   )
          // }
        }
      }
  return (
    <Page title="Login">
      <div className="align-items-center">
      {authLink()}
        
      </div>
    </Page>
  )
}

export default HomePage