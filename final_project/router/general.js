const express = require('express');
let books = require("../booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing username or password" });
  if (users.find(user => user.username === username)) return res.status(409).json({ message: "Username exists" });
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 1
public_users.get('/', (req, res) => res.status(200).send(JSON.stringify(books, null, 4)));

// Task 2
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return book ? res.status(200).json(book) : res.status(404).json({ message: "Book not found" });
});

// Task 3
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const result = Object.entries(books).filter(([isbn, book]) => book.author === author);
  return result.length ? res.status(200).json(result.map(([isbn, book]) => ({ isbn, ...book }))) :
    res.status(404).json({ message: "No books by this author" });
});

// Task 4
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const result = Object.entries(books).filter(([isbn, book]) => book.title === title);
  return result.length ? res.status(200).json(result.map(([isbn, book]) => ({ isbn, ...book }))) :
    res.status(404).json({ message: "No books with this title" });
});

// Task 5
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return books[isbn] ? res.status(200).json(books[isbn].reviews) :
    res.status(404).json({ message: "Book not found" });
});

// Task 10
public_users.get('/async-books', async (req, res) => {
  return res.status(200).json(await new Promise(resolve => resolve(books)));
});

// Task 11
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    books[isbn] ? resolve(books[isbn]) : reject("Book not found");
  })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 12
public_users.get('/promise/author/:author', (req, res) => {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const result = Object.entries(books).filter(([isbn, book]) => book.author === author);
    result.length ? resolve(result.map(([isbn, book]) => ({ isbn, ...book }))) :
      reject("No books by this author");
  })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 13
public_users.get('/promise/title/:title', (req, res) => {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const result = Object.entries(books).filter(([isbn, book]) => book.title === title);
    result.length ? resolve(result.map(([isbn, book]) => ({ isbn, ...book }))) :
      reject("No books with this title");
  })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
});

module.exports.general = public_users;

public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
