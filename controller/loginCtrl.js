const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();



const loginRoot = (req, res) => {
    res.render('login');
}
const users = [{
    username : 'chanyoung',
    password : '9EdxoZsUuxlpQ3YstOqmP4u8ixH6rmiHcqkVO+/rF70upPqCnVB2fb3QWXXelciQnfFDK+JW2sxq8GZxXCIZWYVz0xw0iJw7xz7nOl1T2dnDlRoDcNhItvSUUeZwEc7/dSHlD8pzxhi88AsSLB20yUGkZdSadraKsqz2qJxnN5M=',
    displayName : 'ChanYoung',
    salt : 'zRlZCKa1cMeUjSH/wFjnc/oWMIS3vN7yQ5U2waE4NJWRED2HDQgqeD3Qvqf+w8pAQyvJ8pFDbyn1jInOw7B85Q===='
}]
const loginAction = (req, res) => {
    const uname = req.body.username;
    const pwd = req.body.password;
    for(let i =0; i<users.length; i++){
        let user = users[i];
        if(uname === user.username){
            return hasher({password:pwd, salt:user.salt}, (err, pass,salt,hash)=>{
                if(hash === user.password){        
                    req.session.displayName = user.displayName;
                    req.session.save(() => {
                        res.redirect('/auth/welcome');
                    })
                } else{
                    res.send('<p>잘못 입력하셨습니다</p> <a href="/auth/login">login</a>');
                }
            })
        }
    }
}

const logout = (req, res) => {
    delete req.session.displayName;
    res.redirect('/auth/welcome');
}
const Welcome = (req, res) =>{
    if(req.session.displayName){
        res.send(`<h1>Hello, ${req.session.displayName}<h1><a href="/auth/logout">logout</a><br><p><a href="/auth/register">signup</a></p>`);
    }else {
        res.send(`<h1>Welcome</h1><a href ="/auth/login">Login</a>`);
    }
}
const Register = (req, res) =>{
    res.render('signup');
}
const RegisterAction = (req, res) => {
    hasher({password:req.body.password}, (err,pass, salt, hash)=>{
        const user ={
            username : req.body.username,
            password : hash,
            salt : salt,
            displayName : req.body.displayName
        };
        users.push(user);
        req.session.displayName = req.body.displayName;
        req.session.save(() =>{
            res.redirect('/auth/welcome');
        });
    })
}

module.exports = {
    logout,
    Welcome,
    loginAction,
    loginRoot,
    Register,
    RegisterAction
}