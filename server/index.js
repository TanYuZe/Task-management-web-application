const express = require("express")
const app = express()
const mysql = require("mysql2")
const cors = require("cors")
const routes = require("./Route/routes")
const config = require("dotenv")
const { raw } = require("mysql")
config.config({ path: "../config/config.env" })
app.use(cors())
app.use(express.json())
app.use(routes)

// app.use("/create", (req, res) => {
//   const name = req.body.name
//   const email = req.body.email
//   const password = req.body.password
//   const roles = req.body.roles
//   const group = req.body.group

//   db.query("INSERT INTO user_info (Username, Email, Password, Roles, Group) VALUES (?,?,?,?,?)", [name, email, password, roles, group], (err, result) => {
//     if (err) {
//       console.log(err)
//     } else {
//       res.send("Values Inserted")
//     }
//   })
// })
app.use((req, res) => {
  let checkURL = req.url
  if(checkURL.includes("?"))
{
  return res.status(400).send({code:400})
}
else
{
  return res.status(404).send({ status: 404 , errormsg: "invalid API endpoint"})
}
})
// app.use((req, res, next) =>{
//   if(Object.keys(req.query).length !== 0){
//     return res.status(400).send({code:400})
//   }
//   next()
// })
app.use((req, res, next)=>
{
  let checkURL = req.url.includes("?")
  console.log(checkURL)
    
if(checkURL)
{
  return res.status(400).send({code:400})
}
next()
})
// app.use(function (req, res, next)
// {
//   var err = null
//   try {
//     decodeURIComponent(req.path)
//   } catch(e)
//   {
//     err = e
//   }
//   if(err)
//   {
//     res.json({message : "Bad Request", code :404})
//   }
//   next()
// })

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001")
})
