const btnAddMovie = document.getElementById("btn-add-movie");
const movieInputs = document.getElementById("wrapper-movie-input");
const inputMovieTitle = document.getElementById("input-movie-title");
const inputMovieYear = document.getElementById("input-movie-year");
const movieList = document.getElementById("movie-list");
const removeZone = document.getElementById("remove-zone");

// Load movies from local storage on page load
function loadMovies() {
  const movies = JSON.parse(localStorage.getItem("movies")) || [];
  movies.forEach((movie) => {
    const movieTitle = document.createElement("li");
    const movieYear = document.createElement("span");

    movieTitle.textContent = movie.title;
    if (movie.year) {
      movieYear.textContent = movie.year;
      movieYear.classList.add("year");
    }

    movieTitle.classList.add("movie-title");
    if (movie.watched) {
      movieTitle.classList.add("watched", "watched-year");
    }
    movieTitle.setAttribute("draggable", "true");
    movieTitle.dataset.id = Date.now(); // Assign unique ID

    movieTitle.appendChild(movieYear);
    movieList.appendChild(movieTitle);

    watchedMovie(movieTitle);
    draggingMovie(movieTitle);
  });
}

// Save movies to local storage
function saveMovies() {
  const movies = Array.from(movieList.children).map((li) => ({
    title: li.firstChild.textContent,
    year: li.querySelector("span").textContent || "",
    watched: li.classList.contains("watched"),
  }));
  console.log(movies);
  localStorage.setItem("movies", JSON.stringify(movies));
}

// Displays movie inputs
btnAddMovie.addEventListener("click", () => {
  movieInputs.classList.toggle("active");
});

// Movies can be added by pressing enter
inputMovieYear.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addMovie();
    inputMovieTitle.value = "";
    inputMovieYear.value = "";
    inputMovieTitle.focus();
  }
});

// Movie gets created and added to the movie list
function addMovie() {
  if (inputMovieTitle.value.trim() === "") return;
  const yearValue = inputMovieYear.value.trim();
  const minYear = parseInt(inputMovieYear.getAttribute("min")) || 1880;
  const maxYear =
    parseInt(inputMovieYear.getAttribute("max")) || new Date().getFullYear();
  if (
    yearValue !== "" &&
    (isNaN(yearValue) || yearValue < minYear || yearValue > maxYear)
  ) {
    return; // Prevent adding invalid years
  }

  const movieTitle = document.createElement("li");
  const movieYear = document.createElement("span");

  movieTitle.textContent = inputMovieTitle.value.trim();
  if (inputMovieYear.value.trim() === "") {
    movieYear.classList.remove("year");
  } else {
    movieYear.textContent = inputMovieYear.value.trim();
    movieYear.classList.add("year");
  }

  movieTitle.classList.add("movie-title");
  movieTitle.setAttribute("draggable", "true");
  movieTitle.dataset.id = Date.now(); // Assign unique ID

  movieTitle.appendChild(movieYear);
  movieList.appendChild(movieTitle);

  watchedMovie(movieTitle);
  draggingMovie(movieTitle);
  saveMovies();
}

// Movie gets marked as watched
function watchedMovie(li) {
  li.addEventListener("click", () => {
    li.classList.toggle("watched");
    li.classList.toggle("watched-year");
    saveMovies(); // Update watched movies
  });
}

// Movies become draggable
function draggingMovie(li) {
  li.addEventListener("dragstart", (event) => {
    removeZone.classList.add("active");
    li.classList.add("dragging", "dragging-year");
    event.dataTransfer.setData("text/plain", li.dataset.id); // Store unique ID
  });

  li.addEventListener("dragend", () => {
    removeZone.classList.remove("active");
    li.classList.remove("dragging", "dragging-year");
  });
}

// Dragged movies are dropable in the remove zone and are removed
function setupRemoveZone() {
  removeZone.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  removeZone.addEventListener("drop", (event) => {
    event.preventDefault();
    const draggedMovieId = event.dataTransfer.getData("text/plain");
    // Find the movie with the matching text content
    const movieToRemove = Array.from(movieList.children).find(
      (li) => li.dataset.id === draggedMovieId
    );
    if (movieToRemove) {
      movieToRemove.remove(); // Only remove the movie being dragged
      saveMovies(); // Update saved movies
    }
    removeZone.classList.remove("active");
    removeZone.style.border = "none";
  });

  removeZone.addEventListener("dragenter", () => {
    removeZone.style.border = "1px solid var(--clr-text-1)";
  });

  removeZone.addEventListener("dragleave", () => {
    removeZone.style.border = "none";
  });
}

// Functions after HTML is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Remove zone is setup once
  setupRemoveZone();
  // Load movies from local storage
  loadMovies();
  // Set max year dynamically
  inputMovieYear.setAttribute("max", new Date().getFullYear());
});

// PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker registered"))
      .catch((err) => console.log("Service Worker error:", err));
  });
}
