import React, { useState, useContext } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"

// My Components
import Header from "./components/Header"
import Login from "./components/Login"
import Admin from "./components/Admin"
import UserProfile from "./components/UserProfile"
import { AuthProvider } from "./context/authContext"
import { ApplicationProvider } from "./context/appContext"
import Unauthorized from "./components/Unauthorized"
import Protected from "./hooks/Protected"
import PageNotFound from "./components/PageNotFound"
import NavBar from "./components/NavBar"
import HomePage from "./components/HomePage"
import AuthContext from "./context/authContext"
import TaskPanel from "./components/taskPanel"
import Board from "./components/Board"

//Context

function Main() {

const [role, setRole] = useState("")

  return (
    <>
      <AuthProvider>
        <ApplicationProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              
              <Route path="/" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="/homepage" element={<HomePage/>} />
              {/* <Route path="/board" element={<Board/>} /> */}

              
              
               <Route path="/admin" element={<Protected allowedRoles={["admin"]} >
                <Admin />
                </Protected>}/> 
                <Route path="/profile" element={<Protected allowedRoles={["admin","user"]} >
                <UserProfile />
                </Protected>}/> 
                <Route path="/board" element={<Protected allowedRoles={["admin","user"]} >
                <Board />
                </Protected>}/> 
            </Routes>
            
            
            
          </BrowserRouter>
        </ApplicationProvider>
      </AuthProvider>
      
      
      
    </>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
