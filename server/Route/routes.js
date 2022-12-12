const express = require("express")
const router = express.Router()
//const auth = require("../controllers/authController.js");

const { getusergrp, addUser, getAllUser, getupdateInfo, getuser, viewall, viewgroup, userLogin, addGroup, updateStatus, Login, getdecode, hash, Authcheckgroup, getStatus} = require("../controller/UserController")
const {getPlanInfo, createPlan, getPlansOfApp} = require("../Controller/PlanController")
const {PromoteTaskToDone, GetTaskbyState, createtask, createTask, getTasksOfApp, moveTask, moveTaskState, updateTask, sendDoneTaskEmail} = require("../Controller/TaskController")
const {updateApp, createApp, getAppsname,getOneApp, getByApp} = require("../Controller/AppController")
router.route("/create").post(addUser)
router.route("/all").get(getAllUser)
router.route("/updateinfo").post(getupdateInfo)
router.route("/getuser").post(getuser)
router.route("/users").get(viewall)
router.route("/grouplist").get(viewgroup)
router.route("/login").post(Login)
router.route("/addgroup").post(addGroup)
router.route("/getdecode").post(getdecode)
router.route("/hash").post(hash)
router.route("/checkgroup").post(Authcheckgroup)
router.route("/getstatus").post(getStatus)
router.route("/getusergrp").post(getusergrp)

//PLAN
router.route("/createplan").post(createPlan)
router.route("/getplans").post(getPlansOfApp)
router.route("/getPlanInfo").post(getPlanInfo)
//Task
router.route("/createTaskk").post(createTask)
router.route("/gettask").post(getTasksOfApp)
router.route("/movetaskstate").post(moveTaskState)
router.route("/updatetask").post(updateTask)
router.route("/senddonetaskemail").post(sendDoneTaskEmail)
//A3 task
router.route("/CreateTask").post(createtask)
router.route("/GetTaskByState").post(GetTaskbyState)
router.route("/PromoteTask2Done").post(PromoteTaskToDone)
//router.route("/getemailofdone").post(getemailofdone)
//APP
router.route("/createApp").post(createApp)
router.route("/getAppsname").post(getAppsname)
router.route("/getoneapp").post(getByApp)
router.route("/updateapp").post(updateApp)




module.exports = router