const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to set up session management
app.use(session({
  secret: 'secret-key',      // Replace with a strong secret key
  resave: false,             // Whether to save the session data if there were no modifications
  saveUninitialized: true,   // Whether to save new but not modified sessions
  cookie: { secure: false }  // Set to true in production with HTTPS
}));

app.use(express.json());

app.use("/customer/auth/*",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  console.log(req.session.user);
  if (req.session.user) {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=> {
  console.log("Server is running")
});
