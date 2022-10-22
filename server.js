// ===dependencies===
// our Book model that our database will use
const Book = require("./models/book.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// method-override, allows us to use delete method in our browser
const methodOverride = require("method-override");
// pulling env variables from .env file
require("dotenv").config();
const PORT = process.env.PORT;
mongoose.connect(process.env.DATABASE_URL);
// ===middleware===
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
// captures requests for PUT and DELETE methods and converts them from a POST method.
app.use(methodOverride("_method"));
// ===database connection logs===
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is mongo not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

//// ===I N D U C E S=== (index, new, delete, update, create, edit, show)
// ===index===
app.get("/books", (req, res) => {
  Book.find({}, (error, allBooks) => {
    res.render("index.ejs", {
      books: allBooks,
    });
  });
});
// ===new===
app.get("/books/new", (req, res) => {
  res.render("new.ejs");
});
// ===delete===
app.delete("/books/:id", (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err, deletedBook) => {
    res.redirect("/books");
  });
});
// ===update===
app.put("/books/:id", (req, res) => {
  // check if completed box is checked
  req.body.completed = req.body.completed === "on" ? true : false;
  // find the record in DB
  Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    // sends updated book as a new record and not old the record
    { new: true },
    (err, updatedBook) => {
      res.redirect(`/books/${req.params.id}`);
    }
  );
  // update values
  // save updated values to DB
});
// ===create===
app.post("/books", (req, res) => {
  // save that data to our booklist db
  // send back a copy/message so the user knows it was successful
  // formating Checkbox Data Properly
  if (req.body.completed === "on") {
    //if checked, req.body.completed is set to 'on'
    req.body.completed = true;
  } else {
    //if not checked, req.body.completed is undefined
    req.body.completed = false;
  }
  Book.create(req.body, (error, createdBook) => {
    res.redirect("/books");
  });
});
// ===edit===
app.get("/books/:id/edit", (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    res.render("edit.ejs", {
      book: foundBook,
    });
  });
});
// ===show===
app.get("/books/:id", (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    res.render("show.ejs", { book: foundBook });
    // res.redirect("/books/");
  });
});
//// ===listener===
app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
