const app = require("../app");
const db =require("../config/dbConn");

const data = (parameters) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM login WHERE id =?`,[parameters.id], (err,db_data)=>{
            if(err) {
                reject(err);
            }else{
                resolve(db_data);
            }
        })
 
    })
}

module.exports ={
    data
}