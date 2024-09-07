const express = require("express");
const books = require("./booksdb.js");
const { doesExist, isValid } = require("./auth-users.js");
const { users } = require("./auth-users.js");

const publicUsers = express.Router();

publicUsers.post("/register", (req, res) => {
  const { password, username } = req.body;

  if (!password || !username) {
    return res.status(400).json({ message: "Provide username and password" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username not valid" });
  }

  if (doesExist(username)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });

  return res
    .status(200)
    .json({ message: "Customer successfully registered. Now you can login" });
});

// Get the book list available in the shop
publicUsers.get("/", function (req, res) {
  return res.status(200).json({ books });
});

// Get book details based on ISBN
publicUsers.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res
      .status(404)
      .json({ message: `Book with isbn: ${isbn} not found` });
  }
  return res.status(200).json(book);
});

// Get book details based on author
publicUsers.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author.trim().toLowerCase() === author.trim().toLowerCase()
  );
  return res.status(200).json({
    booksByAuthor,
  });
});

// Get all books based on title
publicUsers.get("/title/:title", function (req, res) {
  const { title } = req.params;
  const booksByTitle = Object.values(books).filter(
    (bk) => bk.title.trim().toLowerCase() === title.trim().toLowerCase()
  );
  return res.status(200).json({
    booksByTitle,
  });
});

//  Get book review
publicUsers.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    return res
      .status(404)
      .json({ message: `Book with isbn: ${isbn} not found` });
  }
  const reviews = book.reviews;
  return res.status(200).json({ reviews });
});

module.exports.general = publicUsers;
