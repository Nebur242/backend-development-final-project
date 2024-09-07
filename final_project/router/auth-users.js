const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regdUsers = express.Router();

const users = [];

const isValid = (username) => {
  // Check the length of the username
  if (username.length < 4 || username.length > 15) {
    return false;
  }

  // Regular expression to check valid characters and no consecutive underscores
  const validUsernameRegex = /^[a-zA-Z0-9]+(_?[a-zA-Z0-9]+)*$/;

  // Ensure the username doesn't start or end with an underscore
  if (username.startsWith("_") || username.endsWith("_")) {
    return false;
  }

  // Check if the username matches the regex
  return validUsernameRegex.test(username);
};

const doesExist = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regdUsers.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (!authenticatedUser(username, password)) {
    return res
      .status(400)
      .json({ message: "Invalid Login. Check username and password" });
  }
  // Generate JWT access token
  const accessToken = jwt.sign(
    {
      data: password,
    },
    "access",
    { expiresIn: 60 * 60 }
  );

  // Store access token and username in session
  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({ message: "Costumer successfully logged in" });
});

// Add a book review
regdUsers.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;
  const { review } = req.query;

  if (!review) {
    return res.status(400).json({ message: `Provide review text` });
  }

  const book = books[isbn];
  if (!book) {
    return res
      .status(404)
      .json({ message: `Book with isbn: ${isbn} not found` });
  }

  book.reviews[username] = {
    review,
  };

  return res.status(200).json({
    message: `The review for the book with IBSN ${isbn} has been added/updated`,
  });
});

// Delete a book reviews
regdUsers.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;

  const book = books[isbn];
  if (!book) {
    return res
      .status(404)
      .json({ message: `Book with isbn: ${isbn} not found` });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: `No reviews found for this book` });
  }

  delete book.reviews[username];

  return res.status(200).json({
    message: `Review for the isbn ${isbn} posted by the user ${username} was deleted`,
  });
});

module.exports.authenticated = regdUsers;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;
