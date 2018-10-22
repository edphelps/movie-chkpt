
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const morgan = require('morgan');
var clone = require('clone');

const view = require('./view');

// setup middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

// setup static html folder
// this should automagically pull up ./public/index.html
// when user hits the root of the site:  http://www.my-site.com/
app.use(express.static('public'));

// routes
app.use('/movies', view);

// ===========================================================
// 404
// ===========================================================
app.use((req, res, next) => {
  console.log("=========== 404 ==========");
  res.status(404).json({ message: "Page not found" });
  next();
});

/* **************************************************
*  restructureError()
*  If not restructured information is lost when passed back to AJAX caller
*  @param Error -- actual Error object with optional 'status'
*  Returns object { message: 'xxxx', status: 123, name: 'xxx', stack: 'xxx' }
***************************************************** */
function restructureError(error) {
  // return if error not in the expected form
  if (!error.stack)
    return error;

  const restructured = {
    error: {
      message: error.message,
      status: error.status,
      name: error.name,
    },
  };

  // look for " at " which seperates the error message from actual call stack
  const i = error.stack.search(' at ');
  restructured.error.stack = (i === -1) ? error.stack : error.stack.slice(i + 4);

  return restructured;
}

// ===========================================================
// Error handler for next(object) / 500
// ===========================================================
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.log("======================= APP ERROR IN CONTROLLER =======================");
  console.log('status: ',status);
  console.log(err);
  console.log('-------');
  console.log(restructureError(err));
  console.log("^^^^^^^^^^^^^^^^^^^^^^^ APP ERROR IN CONTROLLER ^^^^^^^^^^^^^^^^^^^^^^");
  res.status(status).json(restructureError(err));
  next();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Movie API listening on port ${port}!`);
  });
}

module.exports = app;
