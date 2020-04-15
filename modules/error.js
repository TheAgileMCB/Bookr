'use strict';

function handleError(err, request, response) {
  let viewModel = {
    error: err,
  };
  response.status(err.status);
  response.render('../views/pages/error-view', viewModel);
}

module.exports = handleError;
