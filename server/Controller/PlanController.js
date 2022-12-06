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
exports.checkPlanName = async (req ,res) => {
    const plan_MVP_name = req.body
    const appAcronym = req.body
    let sql = `SELECT * FROM users.plan WHERE Plan_MVP_name = ${plan_MVP_name} AND Plan_app_Acronym = ${JSON.stringify(appAcronym)}`;

    const results = await db.promise().query(sql);
    return results[0][0]
};

exports.getPlanInfo = async (req ,res) => {
    const plan_MVP_name = req.body
    const appAcronym = req.body
    let sql = `SELECT * FROM users.plan WHERE Plan_MVP_name = ${plan_MVP_name} AND Plan_app_Acronym = ${JSON.stringify(appAcronym)}`;
    db.query(sql, (error, results) => {
        if (error) {
            res.send("Error");
        } else {
            res.send(results[0]);
        }
    })
};

//Get all plan
exports.getPlansOfApp = async (req, res, next) => {
    const { acronym } = req.body;

    let sql = `SELECT * FROM plan WHERE Plan_app_Acronym = "${acronym}"`;
    db.query(sql, (error, results) => {
        if (error) {
            res.send("Error");
        } else {
            res.send(results);
        }
    })
};

//Create plan
// exports.createPlan = async (req, res, next) => {
//     const { 
//         planMVPName,
//         planStartDate,
//         planEndDate,
//         application
//     } = req.body;
    
//     const existingPlan = await this.checkPlanName(JSON.stringify(planMVPName), application);

//     if(!planMVPName.replace(/\s/g, '').length){
//         res.send("no plan");
//     } else if(existingPlan){
//         console.log("plan exists");
//         res.send("plan exists");
//     } else {
//         let sql = `INSERT INTO plan (plan_MVP_name, plan_startDate, plan_endDate, Plan_app_Acronym) VALUES (${JSON.stringify(planMVPName)}, ${planStartDate? JSON.stringify(planStartDate) : null}, 
//         ${planEndDate? JSON.stringify(planEndDate) : null}, ${JSON.stringify(application)})`;
//         db.query(sql, (error, results) => {
//             if (error) {
//                 console.log(error);
//                 res.send("Error");
//             } else {
//                 console.log("success")
//                 res.send("success");
//             }
//         })
//     }
// };
exports.createPlan = async (req, res, next) => {
    const { 
        planMVPName,
        planStartDate,
        planEndDate,
        application
    } = req.body;
    if(planMVPName==="" || planStartDate ==="" || planEndDate === "")
    {
        res.send("all fields need to entered")
    }
    else
    {
    
        let sql = `INSERT INTO plan (plan_MVP_name, plan_startDate, plan_endDate, Plan_app_Acronym) VALUES (${JSON.stringify(planMVPName)}, ${planStartDate? JSON.stringify(planStartDate) : null}, 
        ${planEndDate? JSON.stringify(planEndDate) : null}, ${JSON.stringify(application)})`;
        db.query(sql, (error, results) => {
            if (error) {
                if(error.errno == 1062)
                {
                    res.send("duplicate name")
                }
                else{
                    res.send("error")
                }
            } 
            else {
                //console.log("success")
                res.send("success");
            }
        })
    }
};