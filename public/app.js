
const URL = "http://localhost:3000/movies/";

// DOM loaded
document.addEventListener('DOMContentLoaded', () => {

  console.log("DOM LOADED!!!!!!!!");

  // handler the the create-post button in the heading
  // document.getElementById("create-post").onclick = onclickCreate;

  // init(); // do a manual call in case user refreshed page, which causes it
          // to clear but doesn't change the hash so onhashchange() won't fire

  // render everything when the window url hash changes
  // window.onhashchange = init;
});
