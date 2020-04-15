'use strict';
require('dotenv').config();

const superagent = require('superagent');
const BOOK_KEY = process.env.BOOK_KEY;

//queries the API
function bookHandler(request, response, next) {
  const url = 'https://www.googleapis.com/books/v1/volumes';
  superagent(url)
    .query({
      key: BOOK_KEY,
      q: `+in${request.body.radio}:${request.body.searchTerm}`
    })
    .then(bookResponse => {
      console.log(response.body);
      const bookData = bookResponse.body; // JSON.parse(bookResponse.text);
      const bookResults = bookData.items.map(bookStats => {
        return new Book(bookStats);
      });
      response.send(bookResults);
      // response.render('pages/searches/show');
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
  // grab image url and replace http route with https with regex

  // this.publicationDate = 'mysteries of the universe',
  // this.ISBN = 
  // this.summary = 
}

module.exports = bookHandler;
