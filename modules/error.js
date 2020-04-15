'use strict';

function handleError(err, response) {
  let viewModel = {
    error: err,
  };
  response.render('pages/error-view', viewModel);
}

module.exports = handleError;
