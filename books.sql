-- DROP TABLE IF EXISTS locations;

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    author VARCHAR(50),
    isbn VARCHAR(20),
    image_url VARCHAR(255),
    summary VARCHAR(1000),
    bookshelf VARCHAR(30),
  );