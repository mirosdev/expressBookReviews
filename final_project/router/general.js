const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400)
      .send(JSON.stringify({message: 'Username or password missing!'}, null, 4));
  }

  if (!isValid(req.body.username)) {
    return res.status(400)
      .send(JSON.stringify({message: 'Username already taken'}, null, 4))
  }

  users.push({
    username: req.body.username,
    password: req.body.password,
  });

  return res.status(200)
    .send(JSON.stringify({message: 'Successfully registered!'}, null, 4))
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const promise = new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch(e) {
      reject(e.message);
    }
  });

  promise.then((data) => {
    return res.send(JSON.stringify(data, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const promise = new Promise((resolve, reject) => {
    try {
      resolve(books[req.params.isbn]);
    } catch(e) {
      reject('Bad request');
    }
  })

  promise.then((book) => {
    if (book) {
      return res.send(JSON.stringify(book));
    }
  }).catch((e) => {
    return res.status(404).json({message: e});
  })
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const promise = new Promise((resolve, reject) => {
    try {
      resolve(Object.values(books).findIndex((value) => value.author.includes(req.params.author)));
    } catch(e) {
      reject(e.message);
    }
  });

  promise.then((bookIndex) => {
    if (bookIndex > -1) {
      return res.send(JSON.stringify(books[bookIndex + 1]));
    }
    return res.status(404).json({message: 'Book not found.'});
  }).catch((e) => {
    return res.status(500).json({message: e});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const promise = new Promise((resolve, reject) => {
    try {
      resolve(Object.values(books).findIndex((value) => value.title.includes(req.params.title)));
    } catch(e) {
      reject(e.message);
    }
  });

  promise.then((bookIndex) => {
    if (bookIndex > -1) {
      return res.send(JSON.stringify(books[bookIndex + 1]));
    }
    return res.status(404).json({message: 'Book not found.'});
  }).catch((e) => {
    return res.status(500).json({message: e});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  book = books[req.params.isbn];
  if (book) {
    return res.send(JSON.stringify({
      reviews: book.reviews,
    }, null, 4));
  }
  return res.status(404).json({message: 'Book not found.'});
});

module.exports.general = public_users;
