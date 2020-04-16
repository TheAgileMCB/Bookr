'use strict';
require('dotenv').config();
const client = require('../utility/database');
const handleError = require('./error');


const superagent = require('superagent');
const BOOK_KEY = process.env.BOOK_KEY;

//queries the API
function getBooksFromApi(request, response, next) {
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
      // response.send(bookResults);
      response.render('pages/searches/show', {data: bookResults});
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
}

function favoriteBookHandler(request, response, next) {
  const {image, title, author, summary, isbn} = request.body;
  const SQL = `
  INSERT INTO books (image_url, title, author, summary, isbn)
  VALUES ($1, $2, $3, $4, $5)
  `;
  const parameters = [image, title, author, summary, isbn];
  return client.query(SQL, parameters)
    .then(result => {
      response.redirect('/');
      console.log('cachedlocation', result);
    })
    .catch(err => {
      handleError(err, request, response);
      console.err('failed to handle three partners together', err);
    });
}


// get books from database
function getBooksFromDb(request, response) {
  const SQL = 'SELECT * FROM books;';

  client.query(SQL)
    .then(results => {
      const { rowcount, rows } = results;
      console.log(' / db result', rows);

      // response.send('rows')
      response.render('/index', {
        books: rows
      });
    })
    .catch(err => {
      handleError(err, response);
    });
}



// Book constructor!
function Book(bookStats) {
  this.title = bookStats.volumeInfo.title ? bookStats.volumeInfo.title : 'Title does not exist';
  this.author = bookStats.volumeInfo.authors ? bookStats.volumeInfo.authors : 'Author does not exist';
  this.isbn = bookStats.volumeInfo.industryIdentifiers ? `${bookStats.volumeInfo.industryIdentifiers[0].identifier}` : 'No ISBN available at this time, we are working on setting this up.';
  // parseIsnb(bookStats...)
  this.summary = bookStats.volumeInfo.description;
  this.image = parseBookImage(bookStats.volumeInfo.imageLinks).replace('http:', 'https:');
}

const placeHolderImage = 'https://i.imgur.com/J5LVHEL.jpg';
function parseBookImage(imageLinks) {
  console.log(imageLinks);
  if (!imageLinks) {
    return placeHolderImage;
  }

  return imageLinks.thumbnail || imageLinks.smallThumbnail || placeHolderImage;

}

// grab image url and replace http route with https with regex



module.exports = {
  getBooksFromApi,
  getBooksFromDb,
  favoriteBookHandler
};
