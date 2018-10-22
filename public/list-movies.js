
function displayErrorMessage(sMessage) {
  document.getElementById("error-message").innerText = sMessage;
}

function clearErrorMessage() {
  document.getElementById("error-message").innerText = "";
}


// ==========================================================
// Fill in movie form fields,
// - sAction - controls what happends when form is submitted
// - sSubmitBtn - text for submitbutton
// - oMovie, optional
function fillFormFields(sAction, sSubmitBtn, oMovie = { id: "", title: "", director: "", year: "", rating: "", poster: ""}) {
  frmMovie = document.getElementById("movie-form");
  frmMovie.action.value = sAction;
  frmMovie.id.value = oMovie.id;
  frmMovie.title.value = oMovie.title;
  frmMovie.director.value = oMovie.director;
  frmMovie.year.value = oMovie.year;
  frmMovie.rating.value = oMovie.rating;
  frmMovie.poster.value = oMovie.poster;
  frmMovie.submit.value = sSubmitBtn;
  document.getElementById("poster-image").src = oMovie.poster;
}

// =========================================================
// Return a movie object from the form field value
function getMovieFromForm() {
  const frm = document.getElementById("movie-form");
  return {
    id: frm.id.value, // this is null when creating a new movie
    title: frm.title.value,
    director: frm.director.value,
    rating: frm.rating.value,
    year: frm.year.value,
    poster: frm.poster.value,
  };
}

// =========================================================
// Submit button clicked on edit movie page.
// Action driven by 'action' hidden element:
//   - 'view' - switch to edit mode
//   - 'create' - create a new movie with form content
//   - 'edit' - save the form / update the given movie
function onSubmitMovie() {
  clearErrorMessage();
  try {
    // console.log("evt: ", evt)
    console.log("onSubmitMovie");

    // deternine if we are editing existing movie or creating a new one
    const action = document.getElementById("movie-form").action.value;
    console.log('action: ', action);

    // redisplay/refresh the list of all movies
    // onMenuListMovies();

    let oMovie = {};
    switch (action) {

      // SWITCH TO EDIT MODE -------------------
      case 'view':
        onclickEdit(document.getElementById("movie-form").id.value);
        break;

      // UPDATE AN EXISTING MOVIE RECORD ------
      case 'edit':
        oMovie = getMovieFromForm();
        console.log('------------------------------');
        console.log("=== onsubmitMovie, oMovie: ", oMovie);
        // axios.put(URL+document.getElementById("movie-form").id.value, oMovie)
        axios.put(URL+oMovie.id, oMovie)
          .then((res) => {
            console.log("=== onsubmitMovie res: ", res);
            if (res.data.error) {
              console.log("=== onsubmitMovie in error state, display: ", res.data.error.message);
              displayErrorMessage(res.data.error.message);
              // stay in this view
            }
            else {
              // redisplay/refresh the list of all movies
              onMenuListMovies();
            }
          })
          .catch((error) => {
            console.log("---------- AJAX error on edit ----------");
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log("error.response.data", error.response.data);
              console.log("error.response.status", error.response.status);
              console.log("error.response.headers", error.response.headers);
              if (error.response.data.error) {
                displayErrorMessage(error.response.data.error.message);
              }
              else {
                displayErrorMessage("AJAX error in edit (1)");
              }
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log("error.request", error.request);
              displayErrorMessage("AJAX error in edit (2)");
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('error.message: ', error.message);
              displayErrorMessage(error.message);
            }
            console.log("error.config", error.config);
            console.log("^^^^^^^^^^ AJAX error on edit ^^^^^^^^^^");
          });
        break;

      // CREATE A NEW MOVIE RECORD -------------
      case 'create':
        oMovie = getMovieFromForm();
        console.log("*** post val: ", oMovie);
        axios.post(URL, oMovie)
          .then((res) => {
            if (res.data.error) {
              displayErrorMessage(res.data.error.message);
              // stay in this view
            } else {
              // redisplay/refresh the list of all movies
              onMenuListMovies();
            }
          })
          .catch(function (error) {
            console.log("---------- AJAX error on create ----------");
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log("error.response.data", error.response.data);
              console.log("error.response.status", error.response.status);
              console.log("error.response.headers", error.response.headers);
              if (error.response.data.error) {
                displayErrorMessage(error.response.data.error.message);
              }
              else {
                displayErrorMessage("AJAX error in create");
              }
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log("error.request", error.request);
              displayErrorMessage("AJAX error in create");
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('error.message: ', error.message);
              displayErrorMessage(error.message);
            }
            console.log("error.config", error.config);
            console.log("^^^^^^^^^^ AJAX error on create ^^^^^^^^^^");
          });
        break;

      default:
        console.log(`ERROR: unrecognized action onSubmitMovie: ${action}`);
        throw new Error(`ERROR: unrecognized action onSubmitMovie: ${action}`);
    }
  } catch (error) {
    console.log("CATCH -------", error);
  }

  return false; // prevent the form from acutally submitting
}

// =========================================================
// delete a movie
function onclickDelete(movieId) {
  clearErrorMessage();
  const url = URL + movieId;
  axios.delete(url)
    .then(() => {
      // redisplay/refresh the list of all movies
      onMenuListMovies();
    })
    .catch((error) => {
      console.log("---------- AJAX error ----------");
      console.log(error);
      console.log("^^^^^^^^^^ AJAX error ^^^^^^^^^^");
    });
  return false;
}

// =========================================================
// setup form to view a movie
function onclickView(movieId) {
  clearErrorMessage();
  axios.get(URL + movieId)
    .then((res) => {
      const oMovie = res.data;

      // show the div with the movie editing form
      const elemMovieForm = document.getElementById("content--list-movies--edit");
      changeContentArea(elemMovieForm);

      // fill in the forms and image from the db record
      fillFormFields('view', 'Edit this movie', oMovie);

      frmMovie = document.getElementById("movie-form");

      // set readonly flag
      for (const elem of frmMovie.querySelectorAll('#movie-form input'))
        elem.setAttribute("readonly", true);

      // unhide the poster element (it's hidden when adding a new movie)
      document.getElementById("poster-image").style.display = "block";
      // document.getElementById("poster-image").src = oMovie.poster;

      frmMovie.submit.focus()
    })
    .catch((error) => {
      console.log("---------- AJAX error ----------");
      console.log(error);
      console.log("^^^^^^^^^^ AJAX error ^^^^^^^^^^");
    });
  return false;
}

// =========================================================
// setup form to edit a movie
function onclickEdit(movieId) {
  clearErrorMessage();
  axios.get(URL + movieId)
    .then((res) => {
      const oMovie = res.data;

      // show the div with the movie editing form
      const elemMovieForm = document.getElementById("content--list-movies--edit");
      changeContentArea(elemMovieForm);

      // fill in the forms and image from the db record
      fillFormFields('edit', 'Save', oMovie);

      frmMovie = document.getElementById("movie-form");

      // clear readonly flag set by onclickView()
      for (const elem of frmMovie.querySelectorAll('#movie-form input'))
        elem.removeAttribute("readonly")

      // unhide the poster element (it's hidden when adding a new movie)
      document.getElementById("poster-image").style.display = "block";
      // document.getElementById("poster-image").src = oMovie.poster;

      frmMovie.title.focus();
      frmMovie.title.setSelectionRange(0, frmMovie.title.value.length);

    })
    .catch((error) => {
      console.log("---------- AJAX error ----------");
      console.log(error);
      console.log("^^^^^^^^^^ AJAX error ^^^^^^^^^^");
    });
  return false;
}

// =========================================================
// setup form to add a new movie
function onclickNewMovie() {
  clearErrorMessage();

  // clear the form fields of residual values
  fillFormFields('create', 'add');

  frmMovie = document.getElementById("movie-form");

  // clear readonly flag set by onclickView()
  for (const elem of frmMovie.querySelectorAll('#movie-form input'))
    elem.removeAttribute("readonly")

  // hide the poster image since there's nothing to display when adding a new movie
  document.getElementById("poster-image").style.display = "none";

  // show the div with the movie editing form
  const elemMovieForm = document.getElementById("content--list-movies--edit");
  changeContentArea(elemMovieForm);

  frmMovie.title.focus();

  return false;
}

// =========================================================
// get HTML table of movies
function templateMovieList(aMovies) {
  const htmlStart = `
    <table class='ml-3 table'>
      <tbody>
      <tr>
        <th>Title</th>
        <th>Director</th>
        <th class="text-center">Year</th>
        <th class="text-center">Review</th>
        <th></th>
      </tr>`;
  let htmlMovies = "";
  for (const movie of aMovies) {
    htmlMovies += `
      <tr>
        <td><a href="#" onclick="onclickView(${movie.id})">${movie.title}</a></td>
        <td>${movie.director}</td>
        <td class="text-center">${movie.year}</td>
        <td class="text-center">${movie.rating}</td>
        <td><a href="#" onclick="onclickDelete(${movie.id})">delete</a></td>
      </tr>
    `;
  }
  htmlMovies += '';
  const htmlEnd = "</tbody></table>";
  return htmlStart + htmlMovies + htmlEnd;
}

// =========================================================
// renders the view listing all of the movies in the db
function displayMovieList() {

  clearErrorMessage();

  // show spinner
  // document.querySelector("#content--list-movies .spinner").removeAttribute("hidden");
  document.querySelector("#content--list-movies .spinner").style.display = "block";

  axios.get(URL)
    .then((res) => {

      // sort movies by title
      const aMovies = res.data.sort((m1, m2) => m1.title.localeCompare(m2.title));

      let htmlMovieList = "";

      // add the New Movie button
      htmlMovieList += "<p class='ml-3'><button class='btn btn-primary' onclick='onclickNewMovie()'>New Movie</button></p>";

      // add list of movies
      htmlMovieList += templateMovieList(aMovies);
      const elemDiv =  document.getElementById('list-of-movies');

      // hide spinner
      // document.querySelector("#content--list-movies .spinner").setAttribute("hidden", true);
      document.querySelector("#content--list-movies .spinner").style.display = "none";

      // put everything in the element for display
      elemDiv.innerHTML = htmlMovieList;
    })
    .catch((error) => {
      console.log("---------- AJAX error ----------");
      console.log(error);
      console.log("^^^^^^^^^^ AJAX error ^^^^^^^^^^");
    });
}
