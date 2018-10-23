

/* *****************************************************************************
********************************************************************************
*  Globals
********************************************************************************
***************************************************************************** */

//const URL = "http://localhost:3000/movies/";
const URL = "movies/";

// convenience references to content sections
let gelemContentHome = null;
let gelemContentListMovies = null;


/* *****************************************************************************
********************************************************************************
*  MENU HANDLERS
********************************************************************************
***************************************************************************** */

/* ==================================================
*  changeContentArea()
*
*  Call this to display the correct content area but NOT change the menu.
*  A handler must still dynamically fill the content area.  All other content
*  areas will be hidden.
*
*  @param elemContent (html element) the content area to unhide.
* =================================================== */
function changeContentArea(elemContent) {

  // hide all content sections
  const aElemContent = document.querySelectorAll(".content");
  for (const elem of aElemContent) {
    elem.setAttribute("hidden", true); // TODO: use the more modern method of hiding elements
  }

  // remove any dynamic AJAX content from each 'page', otherwise
  // the generated element IDs start to conflict in the accordion lists
  // on different 'pages'
  const aElemAutoClear = document.querySelectorAll(".auto-clear");
  for (const elem of aElemAutoClear) {
    elem.innerHTML = "";
  }

  // show the content area
  elemContent.removeAttribute("hidden"); // TODO: use more modern method to hide elements
}

/* ==================================================
*  changeMenuAndContentArea()
*
*  Menu choice onClick event handers call this function to
*  set the correct menu choice active and display the
*  correct content area.  The onClick handler must still
*  dynamically fill the content area.  All other content
*  areas will be hidden.
*
*  @param sMenuBtnID (string) ID for the menu button so it can be selected
*  @param elemConten (html element) the content area to unhide.
* =================================================== */
function changeMenuAndContentArea(sMenuBtnID, elemContent) {

  // hide all content sections
  const aElemContent = document.querySelectorAll(".content");
  for (const elem of aElemContent) {
    elem.setAttribute("hidden", true); // TODO: use the more modern method of hiding elements
  }

  // remove the dynamic AJAX content from each 'page', otherwise
  // the generated element IDs start to conflict in the accordion lists
  // on different 'pages'
  const aElemAutoClear = document.querySelectorAll(".auto-clear");
  for (const elem of aElemAutoClear) {
    elem.innerHTML = "";
  }

  // set all menu buttons inactive
  const aElemNavLink = document.querySelectorAll(".nav-link");
  for (const elemNavLink of aElemNavLink) {
    elemNavLink.classList.remove("active");
  }

  // set current menu choice active
  document.getElementById(sMenuBtnID).classList.add("active");

  // show menu's content area
  elemContent.removeAttribute("hidden"); // TODO: use more modern method to hide elements
}


/* ==================================================
*  onMenuHome()
*
*  Menu selection
* =================================================== */
function onMenuHome() {
  changeMenuAndContentArea("nav--home", gelemContentHome);
}

/* ==================================================
*  onMenuListMovies()
*
*  Menu selection
* =================================================== */
function onMenuListMovies() {
  changeMenuAndContentArea("nav--list-movies", gelemContentListMovies);
  displayMovieList();
}

/* *****************************************************************************
********************************************************************************
*  DOM AND INITIAL SETUP
********************************************************************************
***************************************************************************** */


/* ==================================================
*  DOM loaded, setup and set button event listener
* =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded");

  // setup convenience variables
  gelemContentHome = document.getElementById("content--home");
  gelemContentListMovies = document.getElementById("content--list-movies");

  // setup nav bar selection handlers
  document.getElementById("nav--home").onclick = onMenuHome;
  document.getElementById("nav--list-movies").onclick = onMenuListMovies;

  // initial content area display
  onMenuHome();
  onMenuListMovies();
});
