const mongoose = require("mongoose"); // require mongoose

// this is our Book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  completed: Boolean,
});

// this is where we define our model using the Schema we created
const Book = mongoose.model("Book", bookSchema);

// this is how we send vars to other files
module.exports = Book;
