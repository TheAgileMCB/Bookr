'use strict';
require('dotenv').config();

const superagent = require('superagent');
const BOOK_KEY = process.env.BOOK_KEY;
const titleButton = document.getElementById('title'); //document is not defined because of EJS page
const authorButton = document.getElementById('author');


//queries the API
function bookHandler(request, response, next) {
  const url = 'https://www.googleapis.com/books/v1/volumes';

  // radio button variable function
  let searchQuery = () => {
    if (titleButton.checked) {
      return `${request.query.title}+intitle`;
    } else if (authorButton.checked) {
      return `${request.query.author}+inauthor`;
    }
  };

  superagent(url)
    .query({
      key: BOOK_KEY,
      q: searchQuery  //variable to be based on radio button input
    })
    .then(bookResponse => {
      const bookData = bookResponse.body;
      const bookResults = bookData.items.map(bookStats => {
        return new Book(bookStats);
      });
      response.send(bookResults);
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
}
// Book constructor!
function Book(bookStats) {
  this.title = bookStats.volumeInfo.title ? bookStats.volumeInfo.title : 'Title does not exist';
  this.author = bookStats.volumeInfo.authors ? bookStats.volumeInfo.authors : 'Author does not exist';

  // additional constructor data

  // this.publicationDate = 'mysteries of the universe',
  // this.ISBN = 
  // this.summary = 
}

module.exports = bookHandler;
