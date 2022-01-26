const session = require ('express-session')
const MysqlStore = require('express-mysql-session')(session);
require ('dotenv').config({path : ".env"});

const SessionOption = {
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    store : new MysqlStore({
        host : process.env.HOST,
        port : process.env.DB_PORT,
        user : process.env.USER,
        password : process.env.PASSWORD,
        database : process.env.DATABASE
    })
}

const Session = session(SessionOption);

module.exports = Session;