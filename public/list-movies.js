// =========================================================
function onSubmitMovie() {
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
          .then(() => {
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
          .then(() => {
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
// edit a movie
function onclickEdit(movieId) {
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
// add a new movie
function onclickNewMovie() {
  console.log("** NEW");

  // clear the form fields of residual values
  document.getElementById("movie-form").action.value = 'create';
  document.getElementById("movie-form").title.value = "";
  document.getElementById("movie-form").director.value = "";
  document.getElementById("movie-form").year.value = "";
  document.getElementById("movie-form").rating.value = "";
  document.getElementById("movie-form").poster.value = "";
  document.getElementById("poster-image").src = "";

  // show the div with the movie editing form
  const elemMovieForm = document.getElementById("content--list-movies--edit");
  changeContentArea(elemMovieForm);

  // set focus (autofocus doesn't work on 2nd display of form)
  document.getElementById("movie-form").title.focus()

  return false;
}

// =========================================================
// get HTML table of aElemNavLink movies
function templateMovieList(aMovies) {
  const htmlStart = `
    <table class='ml-3'>
      <tbody>
      <tr>
        <th>Title</th>
        <th>Director</th>
        <th>Year</th>
        <th>Review</th>
        <th></th>
        <th></th>
      </tr>`;
  let htmlMovies = "";
  for (const movie of aMovies) {
    htmlMovies += `
      <tr>
        <td>${movie.title}</td>
        <td>${movie.director}</td>
        <td>${movie.year}</td>
        <td>${movie.rating}</td>
        <td><a href="#" onclick="onclickEdit(${movie.id})">edit</a></td>
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
  axios.get(URL)
    .then((res) => {
      // sort movies by title
      const aMovies = res.data.sort((m1, m2) => m1.title.localeCompare(m2.title));

      let htmlMovieList = "";

      // display the New Movie button
      htmlMovieList += "<p class='ml-3'><button class='btn btn-primary' onclick='onclickNewMovie()'>New Movie</button></p>";

      // display movies
      // console.log('aMovies: ', templateMovieList(aMovies));
      htmlMovieList += templateMovieList(aMovies);
      const elemDiv =  document.getElementById('list-of-movies');
      elemDiv.innerHTML = htmlMovieList;
    })
    .catch((error) => {
      console.log("---------- AJAX error ----------");
      console.log(error);
      console.log("^^^^^^^^^^ AJAX error ^^^^^^^^^^");
    });
}
