const mysql = require("mysql2")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const key = "ksjdskjdskmdksmdk"

const config = require("dotenv")
config.config({ path: "./config/config.env" })
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
})

const validPassword = password => {
  password = password.replaceAll('"', "")

  let regExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,11}$/
  if (!regExp.test(password)) {
    return false
  } else {
    return true
  }
}
function splitStr(str) {
  // Function to split string
  var string = str.split(",")

  console.log(string)
}

exports.hash = async (req, res) => {
  const { password } = req.body
  const hash = await bcrypt.hash(password, 5)
  console.log(password)
  console.log(hash)
  const result = await bcrypt.compare(password, hash)
  //res.send(result)
  res.send(result)
}

exports.addUser = async (req, res) => {
  const { name, email, password, group } = req.body

  if (name === "" || password === "" || email === "") {
    res.send("you need to fill in all the information")
  } else {
    if (validPassword(password) == false) {
      res.send("password must be minimum 8 and maximum 11 with symbols")
    } else {
      const hash = await bcrypt.hash(password, 5)
      db.query("INSERT INTO user_info (username, email, password, groupname, status) VALUES (?, ?, ?, ?, ?);", [name, email, hash, group, "active"], (err, result) => {
        if (err) {
          
            if(err.errno == 1062)
            {
              res.send("username already exist")
            }
            else{
              res.send("error")
            }
        } else {
          res.send("Values Inserted")
        }
      })
    }
  }
}

exports.addGroup = (req, res) => {
  const { group } = req.body
  if (group === "") {
    res.send("fields cannot be empty")
    
  } else {
    db.query("INSERT INTO users.grouplist (groupList) VALUES (?);", [group], (err, result) => {
      if (err) {
        if(err.errno == 1062)
        {
          res.send("duplciate value")
        }
        else{
          res.send("error")
        }
      }
      
      else {
        res.send("Values Inserted")
      }
    })
  }
}
// exports.addGroup = (req, res) => {
//   const { group } = req.body
//   if (group === "") {
//     res.send("fields cannot be empty")
    
//   } else {
//     db.query("SELECT * FROM users.grouplist WHERE BINARY groupList = ?;", [group], (err, result) => {
//       if (err) {
        
//           res.send("error")
//       }
//       else if(result.length > 0){
//         res.send("group already exist")
//       }
//       else
//       {
//         db.query("INSERT INTO users.grouplist (groupList) VALUES (?);", [group], (err, result) => {
//                 if (err) {
//                   if(err.errno == 1062)
//                   {
//                     res.send("duplciate value")
//                   }
//                   else{
//                     res.send("error")
//                   }
//                 }
                
//                 else {
//                   res.send("Values Inserted")
//                 }
//               })
//       }
      
      
//     })
//   }
// }

exports.getAllUser = (req, res) => {
  db.query("SELECT * FROM users.user_info;", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
}

exports.getuser = (req, res) => {
  const { username } = req.body
  db.query("SELECT * FROM users.user_info WHERE (username = ?)", [username], (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
}
exports.getdecode = (req, res) => {
  const { token } = req.body
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
  res.send(a)
}


exports.getupdateInfo = async (req, res) => {
    const { name, email, password, group, status } = req.body
    if (email === "") {
      res.send("email cannot be empty")
    } 
    else if(password == "")
    {
      
      db.query("UPDATE users.user_info SET email = ?, groupname = ?,  status =? WHERE (username = ?)", [email, group, status, name],(error, results) => {
            if (error){
                res.send("failed");
            } else {
                res.send("User updated");
            }
        });
    }
    else {
      if (validPassword(password) == false) {
        res.send("password must be minimum 8 and maximum 11 with symbols")
      } 
      else {
        const hash = await bcrypt.hash(password, 5)
        db.query("UPDATE users.user_info SET email = ?, password = ?, groupname = ?,  status =? WHERE (username = ?)", [email, hash, group, status, name], (err, result) => {
          if (err) {
            console.log(err)
          } else {
            res.send("User updated")
          }
        })
      }
    }
  }


exports.viewall = (req, res) => {
  // User the connection
  db.query("SELECT * FROM users.user_info", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
}

exports.viewgroup = (req, res) => {
  // User the connection
  db.query("SELECT * FROM users.grouplist", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
}

function checkgroup(username, group)
{
  return new Promise((resolve,reject)=>{
    db.query("SELECT groupname FROM users.user_info WHERE username = ?", [username], (err, result) => {
      if (err) {
        console.log(err)
      } else {
        if (result.length == 0) {
          return false
        } else {
        let groups  =result[0].groupname
        let groupy = groups.split(",")
        let arraygroup = []
        for (let i = 0; i < groupy.length; i++) {
          arraygroup.push(groupy[i])
        }
        if(arraygroup.includes(group)){
          resolve(true)
        }
        else{
          resolve(false)
        }
        }
      }
    })
  })
  //console.log(username, group)
  
}

exports.Authcheckgroup = async (req, res) => {
  // User the connection
  const { username, group } = req.body
  //console.log(1)
  const status = await checkgroup(username, group)
  if(status){
    //console.log("iam admin")
    res.send(true)
  }
  else
  {
    //console.log("iam user")
    res.send(false)
  }
  
  
}
// exports.checkgroup = (req, res) => {
//   // User the connection
//   const { username, group } = req.body
//   db.query("SELECT groupname FROM users.user_info WHERE username = ?", [username], (err, result) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(result)
//       if (result.length == 0) {
//         //res.send("not in group")
//         res.json({ isAdmin: false , role: "user"})
        
//       } else {
//         let groups = result[0].groupname
//         let groupy = groups.split(",")
//         let arraygroup = []
//         for (let i = 0; i < groupy.length; i++) {
//           arraygroup.push(groupy[i])
//         }
//         //changing value into array, by spilting the value by , and pushing into
//         if (arraygroup.includes(group)) {
//           res.json({ isAdmin: true , role: "admin"})
          
//         } else {
//           res.json({ isAdmin: false , role: "user"})
//         }
//       }
//     }
//   })
// }
exports.getStatus= (req,res) => {
  const{username} = req.body
  db.query("SELECT status FROM users.user_info WHERE username = ?", [username], async (error, result) => {
    if (error) {
      console.log(error)
     // res.send(result)
    }
    else 
    {
      if(result.length > 0)
      {
      if(result[0].status !== "active")
      {
        
        res.json({Status:"disabled"})
      }
      else{
      res.json({Status:"active"})
    
      //res.send(result[0].status)
    }
  }
  else
  {
    res.send("error")
  }
    }
  })
}

exports.Login = (req, res) => {
  const { username } = req.body
  const { password } = req.body
  //console.log(process.env.PORT)
  db.query("SELECT * FROM users.user_info WHERE BINARY username = ?", [username], async (error, result) => {
    if (error) {
      console.log(error)
      res.send(result)
      //res.json({errors: true})
    } else {
      if (result.length > 0) {
        console.log(JSON.stringify(result[0].status))
        
          
          const hash = result[0].password
          const results = await bcrypt.compare(password, hash)
          if (results) {
            let token = jwt.sign(
              {
                username
              },
              key
            )
            res.json({ token, success: true })
          } else {
            res.json({ error: "username/password wrong please enter again" })
          }
        
      } else {
        res.json({ error: "username/password wrong please enter again" })
      }
    }
  })
}

exports.getusergrp = async (req, res) => {
  const { username } = req.body
  db.query("SELECT groupname FROM users.user_info WHERE username = ?", [username], (err, result) => {
    if (err) {
      res.send(err)
    } else {
      if (result.length == 0) {
        return false
      } else {
      let groups  =result[0].groupname
      let groupy = groups.split(",")
      let arraygroup = []
      for (let i = 0; i < groupy.length; i++) {
        arraygroup.push(groupy[i])
      }
      // if(arraygroup.includes("team member")){
      //   res.send("team member")
      // }
      // else if(arraygroup.includes("project lead")){
      //   res.send("project lead")
      // }
      // else if(arraygroup.includes("project manager")){
      //   res.send("project manager")
      // }
      // else if(arraygroup.includes("config manager")){
      //   res.send("config manager")
      // }
      // else if(arraygroup.includes("Admin")){
      //   res.send("Admin")
      // }
      // else if(arraygroup.includes("team lead")){
      //   res.send("team lead")
      // }
      // else{
      //   res.send("error/normal user detected")
      // }
      res.send(arraygroup)
      }
    }
  })
}


