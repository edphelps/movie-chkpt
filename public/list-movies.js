
function displayErrorMessage(sMessage) {
  document.getElementById("error-message").innerText = sMessage;
}

function clearErrorMessage() {
  document.getElementById("error-message").innerText = "";
}


// =========================================================
// Save new movie or update existing movie
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

      // UPDATE AN EXISTING MOVIE RECORD
      case 'edit':
        oMovie = {
          title: document.getElementById("movie-form").title.value,
          director: document.getElementById("movie-form").director.value,
          rating: document.getElementById("movie-form").rating.value,
          year: document.getElementById("movie-form").year.value,
          poster: document.getElementById("movie-form").poster.value,
        };
        console.log("*** post val: ", oMovie);
        axios.put(URL+document.getElementById("movie-form").id.value, oMovie)
          .then((res) => {
            if (res.data.error)
              displayErrorMessage(res.data.error.message);

            // redisplay/refresh the list of all movies
            onMenuListMovies();
          })
          .catch((error) => {
            console.log("---------- AJAX error ----------");
            console.log(error);
            console.log("^^^^^^^^^^ AJAX error ^^^^^^^^^^");
          });
        break;

      // CREATE A NEW MOVIE RECORD
      case 'create':
        oMovie = {
          title: document.getElementById("movie-form").title.value,
          director: document.getElementById("movie-form").director.value,
          rating: document.getElementById("movie-form").rating.value,
          year: document.getElementById("movie-form").year.value,
          poster: document.getElementById("movie-form").poster.value,
        };
        console.log("*** post val: ", oMovie);
        axios.post(URL, oMovie)
          .then((res) => {
            if (res.data.error)
              displayErrorMessage(res.data.error.message);

            // redisplay/refresh the list of all movies
            onMenuListMovies();
          })
          .catch((error) => {
            console.log("---------- AJAX error ----------");
            console.log(error);
            console.log("^^^^^^^^^^ AJAX error ^^^^^^^^^^");
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
// setup form to edit a movie
function onclickEdit(movieId) {
  clearErrorMessage();
  console.log("** EDIT: ", movieId);
  axios.get(URL + movieId)
    .then((res) => {
      const oMovie = res.data;

      // show the div with the movie editing form
      const elemMovieForm = document.getElementById("content--list-movies--edit");
      changeContentArea(elemMovieForm);

      // fill in the forms and image from the db record
      document.getElementById("movie-form").action.value = 'edit';
      document.getElementById("movie-form").id.value = oMovie.id;

      document.getElementById("movie-form").title.value = oMovie.title;
      document.getElementById("movie-form").director.value = oMovie.director;
      document.getElementById("movie-form").year.value = oMovie.year;
      document.getElementById("movie-form").rating.value = oMovie.rating;
      document.getElementById("movie-form").poster.value = oMovie.poster;

      // unhide the poster element (it's hidden when adding a new movie)
      document.getElementById("poster-image").style.display = "block";
      document.getElementById("poster-image").src = oMovie.poster;

      // set focus (autofocus doesn't work on 2nd display of form)
      document.getElementById("movie-form").title.focus()
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
  console.log("** NEW");

  // clear the form fields of residual values
  document.getElementById("movie-form").action.value = 'create';
  document.getElementById("movie-form").title.value = "";
  document.getElementById("movie-form").director.value = "";
  document.getElementById("movie-form").year.value = "";
  document.getElementById("movie-form").rating.value = "";
  document.getElementById("movie-form").poster.value = "";

  // hide the poster image since there's nothing to display when adding a new movie
  document.getElementById("poster-image").style.display = "none";

  // show the div with the movie editing form
  const elemMovieForm = document.getElementById("content--list-movies--edit");
  changeContentArea(elemMovieForm);

  // set focus (autofocus doesn't work on 2nd display of form)
  document.getElementById("movie-form").title.focus()

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
        <td><a href="#" onclick="onclickEdit(${movie.id})">${movie.title}</a></td>
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
  // show spinner
  document.querySelector("#content--list-movies .spinner").removeAttribute("hidden");
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
      document.querySelector("#content--list-movies .spinner").setAttribute("hidden", true);

      // put everything in the element for display
      elemDiv.innerHTML = htmlMovieList;
    })
    .catch((error) => {
      console.log("---------- AJAX error ----------");
      console.log(error);
      console.log("^^^^^^^^^^ AJAX error ^^^^^^^^^^");
    });
}
