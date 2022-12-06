const mysql = require("mysql2")
var nodemailer = require("nodemailer")
const { json } = require("express")
const e = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const key = "ksjdskjdskmdksmdk"
// config, config({ path: path.join(__dirname, "..", " .env") })
const { getOneApp } = require("../Controller/AppController")
const { checkPlanName } = require("../Controller/PlanController")
const config = require("dotenv")
config.config({ path: "./config/config.env" })
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
})
const createDateTime = () => {
  return new Date().toString().slice(3, 24).replace("T", " ")
}
//Get amount of task in app
exports.getTaskAmount = async Task_app_Acronym => {
  let sql = `SELECT * FROM users.task WHERE Task_app_Acronym = ${JSON.stringify(Task_app_Acronym)}`

  const results = await db.promise().query(sql)
  return results[0].length
}

//Get task plan
exports.getTaskPlan = async (Task_name, Task_app_Acronym) => {
  let sql = `SELECT Task_plan FROM users.task WHERE Task_name = ${JSON.stringify(Task_name)} AND Task_app_Acronym = ${JSON.stringify(Task_app_Acronym)}`

  const results = await db.promise().query(sql)
  return results[0][0].Task_plan
}

// Get task description
exports.getTaskDescription = async (Task_name, Task_app_Acronym) => {
  let sql = `SELECT Task_description FROM users.task WHERE Task_name = ${JSON.stringify(Task_name)} AND Task_app_Acronym = ${JSON.stringify(Task_app_Acronym)}`

  const results = await db.promise().query(sql)
  return results[0][0].Task_description
}

//get task name
exports.getSingleTask = async (Task_name, Task_app_Acronym) => {
  let sql = `SELECT * FROM users.task WHERE Task_name = ${JSON.stringify(Task_name)} AND Task_app_Acronym = ${JSON.stringify(Task_app_Acronym)}`
  const results = await db.promise().query(sql)
  return results[0][0]
}

//get task by ID
exports.getSingleTaskByID = async (Task_id, Task_app_Acronym) => {
  let sql = `SELECT * FROM users.task WHERE Task_id = ${JSON.stringify(Task_id)} AND Task_app_Acronym = ${JSON.stringify(Task_app_Acronym)}`
  const results = await db.promise().query(sql)
  return results[0][0]
}

//Get Audit note of task
exports.getTaskAudit = async (Task_name, Task_app_Acronym) => {
  let sql = `SELECT Task_notes FROM users.task WHERE Task_name = ${JSON.stringify(Task_name)} AND Task_app_Acronym = ${JSON.stringify(Task_app_Acronym)}`

  const results = await db.promise().query(sql)
  return JSON.stringify(results[0][0].Task_notes)
}

//Get all task
exports.getTasksOfApp = async (req, res, next) => {
  const { acronym } = req.body

  let sql = `SELECT * FROM task WHERE Task_app_Acronym = "${acronym}"`
  db.query(sql, (error, results) => {
    if (error) {
      res.send("Error")
    } else {
      res.send(results)
    }
  })
}

//Create task
// exports.createTask = (async (req, res, next) => {
//   const {
//       application,
//       taskName,
//       addToPlan,
//       taskDescription,
//       taskNote,
//       username
//   } = req.body;

//   const existingTask = await this.getSingleTask(taskName, application);

//   if (!taskName.replace(/\s/g, '').length){
//       res.status(200).send("no task name");
//   } else if(existingTask){
//       res.status(200).send("task exists");
//   } else {
//       const appData = await getOneApp(application);
//       const taskAmount = await this.getTaskAmount(application);

//       const taskID = `${appData.app_acronym}_${+appData.app_Rnumber + taskAmount}`;
//       const taskState= "open";

//       const createDate = new Date().toISOString().slice(0, 10);
//       const date = createDateTime();

//       const createTaskNote = JSON.stringify(`[${username}] created task "${taskName}" on ${date} \nTask state: ${taskState}\n${taskNote?"\nNotes:\n" + taskNote : ""}`);

//       let sql = `INSERT INTO task (Task_id, Task_name, Task_description, Task_notes, Task_plan, Task_app_Acronym, Task_state, Task_creator
//       , Task_owner, Task_createDate) VALUES(${JSON.stringify(taskID)},${JSON.stringify(taskName)},${JSON.stringify(taskDescription)},${createTaskNote},${addToPlan.length? JSON.stringify(addToPlan) : null},${JSON.stringify(application)},${JSON.stringify(taskState)}
//       ,${JSON.stringify(username)}, ${JSON.stringify(username)}, ${JSON.stringify(createDate)})`;
//       db.query(sql, (error, results) => {
//           if (error) {
//               console.log(error);
//               res.send("Error");
//           } else {
//               res.send("success");
//           }
//       })
//   }
// })

exports.createTask = async (req, res, next) => {
  const { application, taskName, addToPlan, taskDescription, taskNote, username } = req.body

  const existingTask = await this.getSingleTask(taskName, application)

  if (!taskName.replace(/\s/g, "").length) {
    res.status(200).send("no task name")
  } else {
    const appData = await getOneApp(application)
    //console.log(appData)
    const taskAmount = await this.getTaskAmount(application)
    //const taskAmount = ""
    const taskID = `${appData.App_Acronym}_${+appData.App_Rnumber + taskAmount}`
    const taskState = "open"

    const createDate = new Date().toString().slice(3, 24)
    const date = createDateTime()

    const createTaskNote = JSON.stringify(`[${username}] created task "${taskName}" on ${date} \nTask state: ${taskState}\n${taskNote ? "\nNotes:\n" + taskNote : ""}`)
    if (taskName === "") {
      res.send("field cannot be empty")
    } else {
      let sql = `INSERT INTO task (Task_id, Task_name, Task_description, Task_notes, Task_plan, Task_app_Acronym, Task_state, Task_creator
      , Task_owner, Task_createDate) VALUES(${JSON.stringify(taskID)},${JSON.stringify(taskName)},${JSON.stringify(taskDescription)},${createTaskNote},${addToPlan.length ? JSON.stringify(addToPlan) : null},${JSON.stringify(application)},${JSON.stringify(taskState)}
      ,${JSON.stringify(username)}, ${JSON.stringify(username)}, ${JSON.stringify(createDate)})`
      db.query(sql, (error, result) => {
        if (error) {
          res.send(error)
        } else {
          res.send("success")
        }
      })
    }
  }
}

//Move Task
exports.moveTaskState = async (req, res, next) => {
  const { username, updatetype, taskInfo } = req.body

  let taskID = taskInfo.Task_id
  let taskName = taskInfo.Task_name
  let currentState = taskInfo.Task_state
  console.log(taskID)

  const date = createDateTime()
  var updateNote
  var newState
  console.log(currentState)
  if (updatetype === "promote") {
    if (currentState == "open") {
      newState = "toDoList"
    }
    if (currentState == "toDoList") {
      newState = "doing"
    }
    if (currentState == "doing") {
      newState = "done"
    }
    if (currentState == "done") {
      newState = "close"
    }
  } else {
    if (currentState == "close") {
      newState = "done"
    }
    if (currentState == "done") {
      newState = "doing"
    }
    if (currentState == "doing") {
      newState = "toDoList"
    }
    if (currentState == "toDoList") {
      newState = "open"
    }
  }

  console.log(currentState)
  updateNote = JSON.stringify(`[${username}] moved "${taskName}" to ${newState} on ${date} \nPrevious State: ${currentState}\nTask State: ${newState}\n\n`)

  let sql = `UPDATE task SET Task_state = ${JSON.stringify(newState)} , Task_notes = CONCAT(${updateNote}, Task_notes), task_owner = ${JSON.stringify(username)} WHERE (Task_id = ${JSON.stringify(taskID)})`
  db.query(sql, (error, results) => {
    if (error) {
      console.log(error)
      res.send("Error")
    } else {
      console.log("success")
      res.send("success")
    }
  })
}

//Move Task
exports.moveTask = async (req, res, next) => {
  const { username, application, updateType, currentState, taskID, taskName, addToPlan, taskDescription, taskNote } = req.body
  console.log(currentState)
  const date = createDateTime()
  var addPlan
  var updateNote
  var newState

  //   let existingPlan = (await this.getTaskPlan(taskName, application))

  //   if (!addToPlan.length){
  //       if (!existingPlan){
  //           addPlan = null
  //       } else {
  //           addPlan = existingPlan
  //       }
  //   } else {
  //       addPlan = addToPlan
  //   }

  let checkPlanChanged = addToPlan
  if (currentState == "open") {
    currentState == "toDoList"
  }
  //   if (updateType === "promote"){
  //       switch (currentState) {
  //           case "open":
  //               currentState = "toDoList"
  //               break;
  //           case "toDoList":
  //               currentState = "doing"
  //               break;
  //           case "doing":
  //               currentState = "done"
  //               break;
  //           case "done":
  //               currentState = "close"
  //               break;
  //       }
  //   } else {
  //       switch (currentState) {
  //           case "doing":
  //               currentState = "toDoList"
  //               break;
  //           case "done":
  //               currentState = "doing"
  //               break;
  //       }
  //   }

  // console.log("---")
  // console.log(addToPlan)
  console.log(currentState)
  console.log(1)
  console.log(currentState)
  // console.log(checkPlanChanged)

  // let existingAudit = await this.getTaskAudit(taskName,application);
  updateNote = JSON.stringify(`[${username}] moved "${taskName}" to ${newState} on ${date} \nTask State: ${newState}\n${taskNote ? "\nNotes:\n" + taskNote + "\n" : ""} \n`)

  let sql = `UPDATE task SET ${checkPlanChanged ? "Task_plan = " + addPlan + "," : ""} ${taskDescription ? "Task_description = " + JSON.stringify(taskDescription) + "," : ""} Task_state = ${JSON.stringify(newState)} , Task_notes = CONCAT(${updateNote}, Task_notes), task_owner = ${JSON.stringify(username)} WHERE (Task_id = ${JSON.stringify(taskID)})`
  db.query(sql, (error, results) => {
    if (error) {
      console.log(error)
      res.send("Error")
    } else {
      console.log("success")
      res.send("success")
    }
  })
}

//Update task
exports.updateTask = async (req, res, next) => {
  const { username, application, currentState, taskID, taskName, addToPlan, taskDescription, taskNote } = req.body

  const date = createDateTime()
  var addPlan

  // console.log("---")
  // console.log(taskNote)

  if (!addToPlan.length) {
    addPlan = null
  } else {
    addPlan = addToPlan
  }

  let existingPlan = await this.getTaskPlan(taskName, application)
  let existingDesc = await this.getTaskDescription(taskName, application)
  let checkPlanChanged = existingPlan !== addPlan

  if (!checkPlanChanged && !taskDescription.length && !taskNote) {
    res.send("no changes")
  } else {
    var updateNote = JSON.stringify(`[${username}] edited "${taskName}" ${checkPlanChanged && taskDescription.length ? "plan and description " : checkPlanChanged && !taskDescription.length ? "plan " : taskDescription.length && !checkPlanChanged ? "description " : ""}on ${date}${!taskNote ? "" : " (added task note)"}\nTask State: ${currentState}\n${!checkPlanChanged ? "" : !existingPlan ? "\nPrevious plan: \nnone assigned" : "\nPrevious Plan: " + existingPlan}${!taskDescription.length ? "" : !existingDesc.length ? "\nPrevious description:\nnone" : "\nPrevious description: " + existingDesc + "\n"}${taskNote ? "Notes:\n" + taskNote + "\n" : ""}\n`)

    let sql = `UPDATE task SET ${addPlan !== existingPlan ? "Task_plan = " + JSON.stringify(addPlan) + "," : ""} ${taskDescription.length ? "Task_description = " + JSON.stringify(taskDescription) + "," : ""} Task_notes = CONCAT(${updateNote}, Task_notes) WHERE (Task_id = ${JSON.stringify(taskID)})`

    db.query(sql, (error, results) => {
      if (error) {
        console.log(error)
        res.send("Error")
      } else {
        if (addPlan !== existingPlan && !taskDescription.length) {
          res.send("plan change")
        } else if (taskDescription.length && addPlan === existingPlan) {
          res.send("desc change")
        } else if (!taskDescription.length && !addPlan && taskNote) {
          res.send("note add")
        } else {
          res.send("plan desc")
        }
      }
    })
  }
}

//Testing email
// exports.sendTestEmail = async () => {
//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: "test@example.com", // sender address
//     to: "jiayi.ang98@hotmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>" // html body
//   })

//   console.log("Message sent: %s", info.messageId)
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }

async function getemailofdone() {
  return new Promise((resolve, reject) => {
    groups = "project lead"
    let sql = `SELECT email FROM user_info WHERE groupname = "${groups}"`
    db.query(sql, (error, results) => {
      if (error) {
        resolve("Error")
      } else {
        resolve(results)
      }
    })
  })
}
exports.sendDoneTaskEmail = async (req, res, next) => {
  const { username, taskInfo, application, donerights } = req.body

  const date = createDateTime()
  //let application = taskInfo.Task_app_Acronym
  const currentAppData = await getOneApp(application)
  const appDoneStateGroup = JSON.parse(currentAppData.App_permit_Done)
  var taskName = taskInfo.Task_name
  var receiverEmailArr = []
  groups = donerights
  groups = groups.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")
  console.log(groups)
  let sql = `SELECT email FROM user_info WHERE groupname = "${groups}"`
  db.query(sql, (error, results) => {
    if (error) {
      res.send("Error")
    } else {
      res.send(results)
      var allUsersEmail = results
      for (var i = 0; i < allUsersEmail.length; i++) {
        receiverEmailArr.push(allUsersEmail[i].email)
      }

      allUsersEmail = JSON.stringify(receiverEmailArr).replace(/\s|\[|\]/g, "")
      console.log(allUsersEmail)
      console.log(receiverEmailArr)
      //allUsersEmail = "yuze12@hotmail.com"

      var emailSubject = `A task has been completed in ${application} by ${username}`

      var emailBody = `
        <div>
            <h3>TASK "<span style="text-transform: uppercase;">${taskName}</span>" IS MOVED TO DONE</h3>
            <h5>[${username}] has moved the task "${taskName}" to DONE on ${date}</h5>
        </div>
        `
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "tanyuze12@gmail.com",
          pass: "ytzdbidasylkkgco"
        }
      })
      // send mail with defined transport object
      var mailoptions = {
        from: "kanban_app@example.com", // sender address
        to: receiverEmailArr, // list of receivers
        subject: emailSubject, // Subject line

        html: emailBody // html body
      }
      transporter.sendMail(mailoptions, function (error, info) {
        if (error) {
          res.send(error)
        } else {
          res.send("Email sent: " + info.response)
          console.log("Email sent: " + info.response)
        }
      })
    }
  })

  // console.log(appDoneStateGroup);
  // console.log(appDoneStateGroup.length);
}
//Send email when task is moved to done state



//A3

function checkgroup(username, group) {
  return new Promise((resolve, reject) => {
    db.query("SELECT groupname FROM users.user_info WHERE username = ?", [username], (err, result) => {
      if (err) {
        console.log(err)
      } else {
        if (result.length == 0) {
          return false
        } else {
          let groups = result[0].groupname
          let groupy = groups.split(",")
          let arraygroup = []
          for (let i = 0; i < groupy.length; i++) {
            arraygroup.push(groupy[i])
          }
          if (arraygroup.includes(group)) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      }
    })
  })
}

//DECODE FUNCTION
function getdecode(token) {
  let a
  if (token === undefined || token === null) {
    return "TOken"
  } else {
    jwt.verify(token, key, (e, decode) => {
      if (e) {
        console.log(e)

        a = false
      } else {
        a = decode
      }
    })
  }
  return a
}
async function sendDoneTaskEmail(username, taskName, application, donerights) {
  

  const date = createDateTime()
  //let application = taskInfo.Task_app_Acronym
  const currentAppData = await getOneApp(application)
  const appDoneStateGroup = JSON.parse(currentAppData.App_permit_Done)
  
  var receiverEmailArr = []
  groups = donerights
  groups = groups.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")
  console.log(groups)
  let sql = `SELECT email FROM user_info WHERE groupname = "${groups}"`
  db.query(sql, (error, results) => {
    if (error) {
      
    } else {
      
      var allUsersEmail = results
      for (var i = 0; i < allUsersEmail.length; i++) {
        receiverEmailArr.push(allUsersEmail[i].email)
      }

      allUsersEmail = JSON.stringify(receiverEmailArr).replace(/\s|\[|\]/g, "")
      console.log(allUsersEmail)
      console.log(receiverEmailArr)
      //allUsersEmail = "yuze12@hotmail.com"

      var emailSubject = `A task has been completed in ${application} by ${username}`

      var emailBody = `
        <div>
            <h3>TASK "<span style="text-transform: uppercase;">${taskName}</span>" IS MOVED TO DONE</h3>
            <h5>[${username}] has moved the task "${taskName}" to DONE on ${date}</h5>
        </div>
        `
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "tanyuze12@gmail.com",
          pass: "ytzdbidasylkkgco"
        }
      })
      // send mail with defined transport object
      var mailoptions = {
        from: "kanban_app@example.com", // sender address
        to: receiverEmailArr, // list of receivers
        subject: emailSubject, // Subject line

        html: emailBody // html body
      }
      transporter.sendMail(mailoptions, function (error, info) {
        if (error) {
          
        } else {
          
          console.log("Email sent: " + info.response)
        }
      })
    }
  })

  
}
//
exports.checkCreaterights = async appAcronym => {
  let sql = `SELECT App_permit_Create FROM users.application WHERE BINARY App_Acronym = ${JSON.stringify(appAcronym)}`

  const results = await db.promise().query(sql)
  return results[0][0]
}
exports.checkDoingDonerights = async appAcronym => {
  let sql = `SELECT App_permit_Doing, App_permit_Done FROM users.application WHERE BINARY App_Acronym = ${JSON.stringify(appAcronym)}`

  const results = await db.promise().query(sql)
  return results[0][0]
}

exports.getAppfromtaskid = async taskid => {
  let sql = `SELECT Task_app_Acronym FROM users.task WHERE BINARY Task_id = ${JSON.stringify(taskid)}`

  const results = await db.promise().query(sql)
  return results[0][0]
}
exports.checktaskstate = async taskid => {
  let sql = `SELECT Task_state FROM users.task WHERE BINARY Task_id = ${JSON.stringify(taskid)}`

  const results = await db.promise().query(sql)
  return results[0][0]
}

//
//
//A3
exports.createtask = async (req, res, next) => {
  const { app_acronym, task_name, task_plan, task_description, task_notes, username, password } = req.body
  let url = req.url.includes("?")
  var regex = /^[A-Za-z0-9 ]+$/

  if (!regex.test(url) || url) {
    res.send({ status: 400})//bad request with ?
  } else {
    if (username === "" || task_name === "" || password === "" || app_acronym === "") {
      res.status(422).send({ status: 422}) //without mandatory parameters
    } else {
      //   console.log("here")
      db.query("SELECT * FROM users.user_info WHERE (BINARY username= ?)", [username], async (error, result) => {
        if (error) {
          res.status(500).send({ status: 500}) //server error status
        } else if (result.length === 0) {
          res.status(401).send({ status: 401})
        } else if (result.length > 0) {
          if (result[0].status === "disabled") {
            res.status(401).send({ status: 401}) //check for disabled
          } else {
            const hash = result[0].password
            const results = await bcrypt.compare(password, hash)
            if (!results) {
              res.status(401).send({ status: 401, errormsg: "invalid credentials" })
            } else {
              const appData = await getOneApp(app_acronym)
              if (appData === undefined) {
                res.status(412).send({ status: 412}) //invalid application id
              } else if (appData.length === 0) {
                res.status(412).send({ status: 412}) //invalid application id
              } else {
                const checkrights = await this.checkCreaterights(app_acronym)
                const rights = checkrights.App_permit_Create.replaceAll('"', "")

                const status = await checkgroup(username, rights)

                if (!status) {
                  res.send({ status: 403})//not permitted user
                } else {
                  const taskAmount = await this.getTaskAmount(app_acronym)
                  const task_id = `${appData.App_Acronym}_${+appData.App_Rnumber + taskAmount}`
                  const taskState = "open"

                  const createDate = new Date().toString().slice(3, 24)
                  const date = createDateTime()

                  const createTaskNote = JSON.stringify(`[${username}] created task "${task_name}" on ${date} \nTask state: ${taskState}\n${task_notes ? "\nNotes:\n" + task_notes : ""}`)

                  let sql = `INSERT INTO task (Task_id, Task_name, Task_description, Task_notes, Task_plan, Task_app_Acronym, Task_state, Task_creator
                , Task_owner, Task_createDate) VALUES(${JSON.stringify(task_id)},${JSON.stringify(task_name)},${JSON.stringify(task_description)},${createTaskNote},${task_plan.length ? JSON.stringify(task_plan) : null},${JSON.stringify(app_acronym)},${JSON.stringify(taskState)}
                ,${JSON.stringify(username)}, ${JSON.stringify(username)}, ${JSON.stringify(createDate)})`
                  db.query(sql, (error, result) => {
                    if (error) {
                      res.status(500).send({ status: 500})//server error status
                    } else {
                      res.status(201).send({ status: 201, task_id})
                    }
                  })
                }
              }
            }
          }
        }
      })
    }
  }
}
//A3 GetTaskbystate
exports.GetTaskbyState = async (req, res, next) => {
  const { task_state, app_acronym, username, password } = req.body
  let url = req.url.includes("?")
  var regex = /^[A-Za-z0-9 ]+$/

  if (!regex.test(url) || url) {
    res.send({ status: 400, errormsg: "bad request" })
  } else {
    if (username === "" || task_state === "" || password === "") {
      res.status(422).send({ status: 422 }) //without mandatory parameters
    } else {
      //   console.log("here")
      db.query("SELECT * FROM users.user_info WHERE (BINARY username= ?)", [username], async (error, result) => {
        if (error) {
          res.status(500).send({ status: 500}) //server error status
        } else if (result.length === 0) {
          res.status(401).send({ status: 401})//invalid credentials
        } else if (result.length > 0) {
          if (result[0].status === "disabled") {
            res.status(401).send({ status: 401})//invalid credentials status disabled
          } else {
            const hash = result[0].password
            const results = await bcrypt.compare(password, hash)
            if (!results) {
              res.status(401).send({ status: 401})//invalid credentials - password wrong
            } else {
              const appData = await getOneApp(app_acronym)
              if (appData === undefined) {
                res.status(412).send({ status: 412 }) //invalid application id
              } else {
                //double check
                if (task_state === "open" || task_state === "todolist" || task_state === "doing" || task_state === "done" || task_state === "close") {
                  db.query("SELECT * FROM users.task WHERE Task_state= ? AND Task_app_Acronym= ?", [task_state, app_acronym], async (error, result) => {
                    if (error) {
                      res.status(500).send({status: 500, error}) //server error status
                    }
                    // else if (result.length == 0) {
                    //   res.status(405).send({ status: 405, errormsg: "state is not valid" }) //state is not valid
                    // }
                    else {
                      res.status(200).send({ status: 200, result: result })
                    }
                  })
                }
                else {
                  res.status(412).send({ code: 412}) //state is not valid
                }
              }
            }
          }
        }
      })
    }
  }
}

//promotetasktodone
exports.PromoteTaskToDone = async (req, res, next) => {
  const { task_id, task_notes, username, password } = req.body

  let url = req.url.includes("?")
  var regex = /^[A-Za-z0-9 ]+$/

  if (!regex.test(url) || url) {
    res.send({ status: 400})//bad request
  } else {
    if (username === "" || task_id ==="" || password === "") {
      res.status(422).send({ status: 422}) //without mandatory parameters
    } else {
      db.query("SELECT * FROM users.user_info WHERE (username= ?)", [username], async (error, result) => {
        if (error) {
          res.status(500).send({ status: 500}) //server error status
        } else if (result.length === 0) {
          res.status(401).send({ status: 401})//invalid credentials
        } else if (result.length > 0) {
          const hash = result[0].password
          const results = await bcrypt.compare(password, hash)
          if (!results) {
            res.status(401).send({ status: 401})//invalid credentials
          } else {
            const result = await this.getAppfromtaskid(task_id)

            const checkrights = await this.checkDoingDonerights(result.Task_app_Acronym)
            const application = result.Task_app_Acronym
            const doingrights = checkrights.App_permit_Doing.replaceAll('"', "")
            const donerights = checkrights.App_permit_Done.replaceAll('"', "")

            const status = await checkgroup(username, doingrights)
            if (!status) {
              res.status(403).send({ status: 403}) //non permitted user
            } else {
              db.query("SELECT * FROM users.task WHERE (Task_id= ?)", [task_id], async (error, result) => {
                if (error) {
                  res.status(500).send({ status: 500}) //server error status
                } else if (result.length === 0) {
                  res.status(412).send({ status: 412}) //taskid does not exist
                } else {
                  taskstate = result[0].Task_state
                  if (taskstate !== "doing") {
                    res.status(413).send({ status: 413}) //Task is not of the correct state (i.e. task is not at the 'doing' stage
                  } else {
                    db.query("UPDATE task SET Task_state = ?, Task_notes =?  WHERE (Task_id= ?)", ["done",task_notes, task_id], async (error, result) => {
                      if (error) {
                        res.status(500).send({ status: 500}) //server error status
                      } else if (result.length == 0) {
                        res.status(405).send({ status: 405}) //state is not valid
                      } else {
                        res.status(200).send({ status: 200})
                        sendDoneTaskEmail(username, task_id, application, donerights)
                        //success code
                      }
                    })
                  }
                }
              })
            }
          }
        }
      })
    }
  }
}




