
// =========================================================
// delete a movie
function onclickDelete(movieId) {
  const url = URL + movieId;
  axios.delete(url)
    .then((res) => {
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
      const oMovie = res.body;
      const elemMovieForm = document.getElementById("content--list-movies--edit");
      changeContentArea(elemMovieForm);
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
  conset elemMovieForm = document.getElementById("content--list-movies--edit");
  changeContentArea(elemMovieForm);
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
      htmlMovieList += "<p class='ml-3'><button class='btn btn-primary' onclick='onclickNewMovie()'>New Movie</button></p>"

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
