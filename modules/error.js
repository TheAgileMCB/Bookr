'use strict';

function handleError(err, request, response) {
  let viewModel = {
    error: err,
  };
  response.status(500).render('../views/pages/error-view', viewModel);
}

module.exports = handleError;
