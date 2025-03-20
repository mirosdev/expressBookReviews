const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return !users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{
  return users.find((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400)
      .send(JSON.stringify({message: 'Username or password missing!'}, null, 4));
  }

  const authUser = authenticatedUser(req.body.username, req.body.password);
  if (!authUser) {
    return res.status(400)
      .send(JSON.stringify({message: 'Wrong username or password!'}, null, 4));
  }

  req.session.user = req.body.username;
  const token = jwt.sign({ username: authUser.username }, 'secret-key', { expiresIn: '1h' });
  return res.status(200).send(JSON.stringify({token: token}, null, 4));
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (req.session.user) {
    const book = books[req.params.isbn];
    if (!book) {
      return res.status(400).send(JSON.stringify({
        message: 'Bad request',
      }, null, 4));
    }

    book.reviews[req.session.user] = {
      username: req.session.user,
      review: req.body.review,
    }

    console.log(books[req.params.isbn]);
    res.status(200).send(JSON.stringify(books[req.params.isbn], null, 4));
  }
  return res.status(401).send(JSON.stringify(
    {
      message: 'Unauthorized'
    }
    , null, 4));
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (req.session.user) {
    const book = books[req.params.isbn];
    if (!book) {
      return res.status(400).send(JSON.stringify({
        message: 'Bad request',
      }, null, 4));
    }

    delete book.reviews[req.session.user];

    console.log(books[req.params.isbn]);
    res.status(200).send(JSON.stringify(books[req.params.isbn], null, 4));
  }
  return res.status(401).send(JSON.stringify(
    {
      message: 'Unauthorized'
    }
    , null, 4));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
