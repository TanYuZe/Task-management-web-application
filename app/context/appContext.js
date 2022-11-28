import React,  { createContext, useState , useEffect , useContext } from "react";
import axios from "axios"

//Context
// import AuthContext from "./authContext"

const ApplicationContext = createContext();

export default ApplicationContext;

export const ApplicationProvider = ({ children, ...rest }) => {

  const [GroupsArray, setGroupsArray] = useState([]);
  const [currApplication, setCurrApplication] = useState("");
  const [currentAppData, setCurrentAppData] = useState("");

  const [tasks, settasks] = useState([])
  // useEffect(() => {
  //   axios
  //     .post("http://localhost:3001/gettask", {
  //       acronym: app
  //     })
  //     .then(res => {
  //       console.log(res.data)
  //       settasks(res.data)
  //     })
  // }, [])

  return(
    <ApplicationContext.Provider value={{ tasks, GroupsArray , setGroupsArray , currApplication, setCurrApplication, currentAppData, setCurrentAppData}}>
        {children}
    </ApplicationContext.Provider>
  )
}