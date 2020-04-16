DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(255),
    image VARCHAR(255),
    summary VARCHAR(8000),
    bookshelf VARCHAR(255)
  );