const mysql = require("mysql2")
const config = require("dotenv")
config.config({ path: "./config/config.env" })
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
})

//Get one Application
exports.getOneApp = ( async (appAcronym) => {
    let sql = `SELECT * FROM users.application WHERE BINARY App_Acronym = ${JSON.stringify(appAcronym)}`;

    const results = await db.promise().query(sql);
    return results[0][0]
});
exports.getByApp = ( async (req, res) => {
    const {acronym} = req.body
    db.query("SELECT * FROM users.application where App_Acronym = ?",[acronym], (err, result) => {
        if(acronym === undefined)
        {
            res.send("undefined")
        }
        else
        {
        if (err) {
          res.send(err)
        } else {
          res.send(result)
        }
    }
      })
});

//Get all application
exports.getAllApps = ( async (req, res, next) => {
    let sql = `SELECT * FROM application ORDER BY App_Acronym ASC`;
    // let sql = `SELECT * FROM application ORDER BY app_startDate ASC`;
    db.query(sql, (error, results) => {
        if (error) {
            res.send("Error");
        } else {
            res.send(results);
        }
    })
});

exports.allApps = ( async (req, res, next) => {
    let sql = `SELECT * FROM application ORDER BY App_Acronym ASC`;
    // let sql = `SELECT * FROM application ORDER BY app_startDate ASC`;

    const results = await db.promise().query(sql);
    return results[0]
});

exports.getAppsname = (req, res) => {
    // User the connection
    db.query("SELECT App_Acronym FROM users.application", (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
    })
  }

//Create application
exports.createApp = ( async (req, res, next) => {
    // const appAcronym = await JSON.stringify(req.body.appAcronym);
    // const permitCreate = await JSON.stringify(req.body.permitCreate);
    const { 
        appAcronym,
        appDescription,
        appRNum,
        appStartDate,
        appEndDate,
        permitCreate,
        permitOpen,
        permitToDoList,
        permitDoing,
        permitDone
    } = req.body;

    // console.log(appAcronym)

    var app_RNum

    if (Number.isInteger(appRNum)){
        app_RNum = appRNum;
    } else {
        app_RNum = Math.round(appRNum);
    }

    console.log(app_RNum);

     const existingApplication = await this.getOneApp(appAcronym);

    if(appAcronym === "" ||
        
        appRNum === "" ||
        appStartDate === "" ||
        appEndDate === "" ||
        permitCreate === "" ||
        permitOpen === "" ||
        permitToDoList === "" ||
        permitDoing === "" ||
        permitDone === "")
        {
            res.send("all fields need to be filled")
    }
       else {
        
        // let sql = `INSERT INTO kanban_web_app.application (App_Acronym, app_permit_create) VALUES (${appAcronym}, '${permitCreate}')`
    
        let sql = `INSERT INTO application (App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_permit_Create, App_permit_Open, app_permit_toDoList, app_permit_Doing, App_permit_Done) VALUES (${JSON.stringify(appAcronym)}, 
        ${JSON.stringify(appDescription)}, ${appRNum}, ${JSON.stringify(appStartDate)}, ${JSON.stringify(appEndDate)}, 
        '${JSON.stringify(permitCreate)}', '${JSON.stringify(permitOpen)}', '${JSON.stringify(permitToDoList)}', '${JSON.stringify(permitDoing)}', 
        '${JSON.stringify(permitDone)}')`;
        db.query(sql, (error, results) => {
            if (error) {
                if(error.errno == 1062)
                {
                    res.send("duplicate name")
                }
                else{
                    res.send("error")
                }
            } else {
                // console.log("done")
                res.send("success");
                
            }
        })
    }
});

//Update application
exports.updateApp = ( async (req, res, next) => {
    const { 
        appAcronym,
        permitCreate,
        permitOpen,
        permitToDoList,
        permitDoing,
        permitDone,
        description,
        enddate,
        startdate
    } = req.body;

    // console.log(
    //     appAcronym,
    //     permitCreate,
    //     permitOpen,
    //     permitToDoList,
    //     permitDoing,
    //     permitDone
    // )

    const existingApplication = await this.getOneApp(appAcronym);
    const existingCreate = existingApplication.app_permit_create;
    const existingOpen = existingApplication.app_permit_open;
    const existingToDoList = existingApplication.app_permit_toDoList;
    const existingDoing = existingApplication.app_permit_doing;
    const existingDone = existingApplication.app_permit_done;

    // console.log(existingApplication)

    if (permitCreate === existingCreate && 
    permitOpen === existingOpen && 
    permitToDoList === existingToDoList &&
    permitDoing === existingDoing &&
    permitDone === existingDone){
        res.send("no permit change")
    } else {
        let sql = `UPDATE application SET app_permit_create = '${JSON.stringify(permitCreate)}',
         app_permit_open = '${JSON.stringify(permitOpen)}', app_permit_toDoList = '${JSON.stringify(permitToDoList)}', 
         app_permit_doing = '${JSON.stringify(permitDoing)}', app_permit_done = '${JSON.stringify(permitDone)}',App_Description ='${description}', App_endDate= '${enddate}',  App_startDate= '${startdate}'  WHERE App_Acronym = ${JSON.stringify(appAcronym)}`;
        db.query(sql, (error, results) => {
            if (error) {
                console.log(error);
                res.send("Error");
            } else {
                // console.log("done")
                res.send("success");
            }
        })
    }
});