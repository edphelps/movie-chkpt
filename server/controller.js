
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const morgan = require('morgan');

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
*  @param Error -- actual Error object with optional 'status'
*  Returns object { status: 123, message: 'xxxx', stack: 'xxx' }
***************************************************** */
function restructureError(error) {
  // return if error not in the expected form
  if (!error.stack)
    return error;

  // look for ' at ' text seperating error message from call stack
  const i = error.stack.search(' at ');
  if (i === -1)
    return { message: error.message, stack: 'undetermined', status: error.status };

  // parse the call_stack portion of the string from end of error.stack
  const restructured = {
    error: {
      message: error.message,
      stack: error.stack.slice(i + 4),
    },
  };
  if (error.status)
    restructured.error.status = error.status;
  return restructured;
}

// ===========================================================
// Error handler for next(object) / 500
// ===========================================================
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.log("======================= APP ERROR IN CONTROLLER =======================");
  console.log(err);
  console.log("^^^^^^^^^^^^^^^^^^^^^^^ APP ERROR IN CONTROLLER ^^^^^^^^^^^^^^^^^^^^^^");
  res.status(status).json(restructureError(err));
  next();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Bookstore API listening on port ${port}!`);
  });
}

module.exports = app;
