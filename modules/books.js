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
      
      const bookData = bookResponse.body; // JSON.parse(bookResponse.text);
      const bookResults = bookData.items.map(bookStats => {
        return new Book(bookStats);
      });
      // response.send(bookResults);
      response.render('pages/searches/show', { data: bookResults });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
}
function detailHandler(request, response) {
  const SQL = `
 SELECT * FROM books WHERE id = $1

 `;
  client.query(SQL, [request.params.id])
    .then(result => {
      response.render('pages/details', { book: result.rows[0] })

    })
    .catch(err => {
      handleError(err, request, response);
    });
}

function favoriteBookHandler(request, response, next) {
  const { image, title, author, summary, isbn } = request.body;
  const SQL = `
  INSERT INTO books (image, title, author, summary, isbn)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id 
  `;
  const parameters = [image, title, author, summary, isbn];
  return client.query(SQL, parameters)
    .then(result => {
      response.redirect(`/details/${result.rows[0].id}`);
      // console.log('cachedlocation', result);
    })
    .catch(err => {
      handleError(err, request, response);
      console.err('failed to handle three partners together', err);
    });
}


// get books from database
function getBooksFromDb(request, response) {
  const SQL = `
  SELECT * FROM books
  `;

  client.query(SQL)

    .then(result => {
      // console.log(result);
      response.render('pages/index', { books: result.rows});
      
    })
    .catch(err => {
      handleError(err, response);
    });
}



function editBookshelf(request,response){
const SQL = `
SELECT *
FROM books
WHERE Id = $1
`;
client.query(SQL, [request.params.book_id])
.then(results => {
  const viewModel = {
   book: results.rows[0]
  };
  response.render('pages/edit-view', viewModel);
})
}

function updateBookshelf(request,response, next) {
  const { summary, bookshelf } = request.body;
  console.log(request.body);
  const SQL = `
  UPDATE books SET
  summary = $1,
  bookshelf = $2
  WHERE Id = $3
`;
const parameters = [summary, bookshelf, parseInt(request.params.book_id)];
client.query(SQL, parameters)
.then(() => {
  response.redirect(`/details/${request.params.book_id}`);
})
.catch(next);
}

function deleteBook(request, response) {
  console.log(request.params);
  const SQL = `
  DELETE FROM books
  WHERE id = $1
  `;

  client.query(SQL, [request.params.book_id])
  .then(() => response.redirect(request.body.redirectUrl || '/'))
  .catch(err => handleError(err, request, response));
}



// Book constructor!
function Book(bookStats) {
  this.title = bookStats.volumeInfo.title ? bookStats.volumeInfo.title : 'Title does not exist';
  this.author = bookStats.volumeInfo.authors ? bookStats.volumeInfo.authors : 'Author does not exist';
  this.isbn = bookStats.volumeInfo.industryIdentifiers ? `${bookStats.volumeInfo.industryIdentifiers[0].identifier}` : 'No ISBN available at this time, we are working on setting this up.';
  // parseIsnb(bookStats...)
  this.summary = bookStats.volumeInfo.description;
  this.image = parseBookImage(bookStats.volumeInfo.imageLinks).replace('http:', 'https:');
  // this.bookshelf = null;
}

const placeHolderImage = 'https://i.imgur.com/J5LVHEL.jpg';
function parseBookImage(imageLinks) {
  if (!imageLinks) {
    return placeHolderImage;
  }

  return imageLinks.thumbnail || imageLinks.smallThumbnail || placeHolderImage;
}


module.exports = {
  detailHandler,
  getBooksFromApi,
  getBooksFromDb,
  favoriteBookHandler,
  editBookshelf,
  updateBookshelf,
  deleteBook
};
