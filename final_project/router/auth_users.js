let users = [];
const isValid = (username) => users.some(user => user.username === username);
const authenticatedUser = (username, password) => users.some(user => user.username === username && user.password === password);

let books = require('../booksdb.js');
const express = require('express');
const router = express.Router();

// Task 7
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing credentials" });
  if (!authenticatedUser(username, password)) return res.status(401).json({ message: "Invalid credentials" });
  req.session.authorization = { username };
  return res.status(200).json({ message: "Logged in successfully" });
});

// Middleware
router.use((req, res, next) => {
  if (req.session.authorization) {
    req.user = req.session.authorization.username;
    next();
  } else {
    return res.status(403).json({ message: "Not logged in" });
  }
});

// Task 8
router.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified successfully" });
  });
  

// Task 9
router.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  });
  

module.exports.authenticated = router;
module.exports.users = users;
module.exports.isValid = isValid;
