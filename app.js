var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Session = require('./config/SessionConn');
var app = express();
const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();

var passport = require('passport');
var LocalStrategy = require('passport-local');
const users = [{
  username : 'chanyoung',
  password : '9EdxoZsUuxlpQ3YstOqmP4u8ixH6rmiHcqkVO+/rF70upPqCnVB2fb3QWXXelciQnfFDK+JW2sxq8GZxXCIZWYVz0xw0iJw7xz7nOl1T2dnDlRoDcNhItvSUUeZwEc7/dSHlD8pzxhi88AsSLB20yUGkZdSadraKsqz2qJxnN5M=',
  displayName : 'ChanYoung',
  salt : 'zRlZCKa1cMeUjSH/wFjnc/oWMIS3vN7yQ5U2waE4NJWRED2HDQgqeD3Qvqf+w8pAQyvJ8pFDbyn1jInOw7B85Q===='
}]

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(Session);
app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStrategy((username, password, done) => {
  const uname = username;
  const pwd = password;
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if (uname === user.username) {
      return hasher({ password: pwd, salt: user.salt }, (err, pass, salt, hash) => {
        if (hash === user.password) {
          console.log('LoclaStrategy', user);
          done(null, user);
        } else {
          done(null, false, user, { message: 'Incorrect password.' });

        }
      });
    }
  }
  done(null, false, { message: 'Incorrect username.' })
}))
passport.serializeUser((user, done)=>{
  done(null,user.username);
})
passport.deserializeUser((id, done) => {
  let user;
  for (let i = 0; i < users.length; i++) {
    user = users[i];
    if (user.username === id) {
      return done(null, user);
    }
  }
})
app.get('/auth/login',
  function (req, res, next) {
    res.render('login');
  })
  app.post('/auth/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/auth/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false
    }
  )
)


app.get('/auth/welcome', (req, res) => {
  if (req.user && req.user.displayName) {
    res.send(`
    <h1>Hello, ${req.user.displayName}</h1>
    <a href="/auth/logout">logout</a>`);
  } else {
    res.send(`
    <h1>Welcome</h1>
    <a href="/auth/login">Login</a><br>
    <a href="/auth/register">Register</a>`);
  }
})
app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/welcome');
});

app.post('/auth/register', (req, res) => {
  hasher({ password: req.body.password }, (err, pass, salt, hash) => {
    const user = {
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };
    users.push(user);
    req.login(user, (err) => {
      req.session.displayName = req.body.displayName;
      req.session.save(() => {
        res.redirect('/auth/welcome');
      });
    });
  });
});
app.get('/auth/register', (req, res) => {
  res.render('signup');
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
