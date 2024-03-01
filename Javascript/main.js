"use strict";
let bookmarks = window.localStorage.getItem("bookmarks")
  ? JSON.parse(window.localStorage.getItem("bookmarks"))
  : [];
const elTemplateMovieItem =
  document.querySelector(".js-movie-template").content;
  const elForm = document.querySelector(".js-form");
const elcategoriesSelect = elForm.querySelector(".js-categories-select");
const elModalBox = document.querySelector(".js-movie-modal");
const elList = document.querySelector(".movies__list");
const elBookTemp = document.querySelector(".js-bookmark-temp").content
const elCanvasBody = document.querySelector(".js-canvas-body")
const elMovieCount = document.querySelector(".js-movie-count")
const MOVIES = movies.slice(0, 30);
const handleCounterMovie = (books = bookmarks) => {
  if(!books.length){
    elMovieCount.classList.add("d-none")
  }else{
    elMovieCount.textContent = books.length
    elMovieCount.classList.remove("d-none")
  }
}
const handleRenderMovies = (arr, regex = "") => {
  if (arr?.length) {
    const elFragment = document.createDocumentFragment();
    elList.innerHTML = "";
    for (const movie of arr) {
      const clone = elTemplateMovieItem.cloneNode(true);
      clone.querySelector(".movies__item").dataset.id = movie.imdb_id;
      clone.querySelector(
        ".js-movie-image"
      ).src = `https://img.youtube.com/vi/${movie.youtube_id}/0.jpg`;
      if (regex && regex.source !== "(?:)") {
        clone.querySelector(
          ".js-movie-title"
        ).innerHTML = `${movie.title.replace(
          regex,
          `<mark class="bg-warning py-0 rounded-1 text-light text-capitalize">${regex.source}</mark>`
        )}`;
      } else {
        clone.querySelector(".js-movie-title").textContent = movie.title;
      }
      clone.querySelector(".js-movie-text").textContent =
        movie.categories.length > 3
          ? `${movie.categories.slice(0, 3).join(" ")} ...`
          : movie.categories.join(", ");
      clone.querySelector(".js-movie-rating").textContent = movie.imdb_rating;
      clone.querySelector(".js-movie-year").textContent = movie.movie_year;
      clone.querySelector(".js-movie-runtime").textContent = (
        movie.runtime / 60
      )
        .toFixed(1)
        .toString()
        .split(".")
        .join(" hours ")
        .concat(" min");
      clone.querySelector(".js-more-info").dataset.id = movie.imdb_id;
      let elbookmarkBtn = clone.querySelector(".js-bookmark")
      if(bookmarks.some((item) => item.imdb_id == movie.imdb_id)){
        elbookmarkBtn.textContent = "Delete Bookmark"
      }else{
        elbookmarkBtn.textContent = "Bookmark"
      }
      elbookmarkBtn.dataset.id = movie.imdb_id
      elFragment.appendChild(clone);
    }
    elList.append(elFragment);
  }
};
const handleFiltercategories = (arr) => {
  let result = [];
  for (const movie of arr) {
    const categories = movie.categories;
    for (const categorie of categories) {
      if (!result.includes(categorie)) {
        result.push(categorie);
      }
    }
  }
  return result;
};
const handleCreateOptions = () => {
  const categories = handleFiltercategories(movies);
  const fragmentOptions = document.createDocumentFragment();
  if (categories?.length) {
    for (const categorie of categories) {
      const newOption = document.createElement("option");
      newOption.value = categorie;
      newOption.textContent = categorie;
      fragmentOptions.appendChild(newOption);
    }
    elcategoriesSelect.appendChild(fragmentOptions);
  }
};
const sortObject = {
  az(a, b) {
    if (a.title.toString() < b.title.toString()) {
      return -1;
    } else {
      return 1;
    }
  },
  za(a, b) {
    if (a.title.toString() > b.title.toString()) {
      return -1;
    } else {
      return 1;
    }
  },
  ["old-year"](a, b) {
    if (a.movie_year < b.movie_year) {
      return -1;
    } else {
      return 1;
    }
  },
  ["new-year"](a, b) {
    if (a.movie_year > b.movie_year) {
      return -1;
    } else {
      return 1;
    }
  },
};
const handleRenderBookmarkMovies = (arr) => {
  if(arr?.length){
    const bookDocFragment = document.createDocumentFragment()
    elCanvasBody.innerHTML = ''
    arr.forEach((item) => {
      const clone = elBookTemp.cloneNode(true)
      clone.querySelector(".js-movie-name").textContent = item.title.split(" ").slice(0, 1).concat("...").join(" ");
      clone.querySelector(".js-movie-image").src = item.img_url;
      clone.querySelector(".js-more-info").dataset.id = item.imdb_id;
      clone.querySelector(".js-movie-categories").textContent = item.categories.slice(0, 1).join(" ")
      clone.querySelector(".js-movie-del").dataset.id = item.imdb_id
      bookDocFragment.appendChild(clone)
    })  
    elCanvasBody.appendChild(bookDocFragment)
  }else{
    elCanvasBody.innerHTML = ''
  }
}
const handleClick = (evt) => {
  if (evt.target.matches(".js-more-info")) {
    const movieId = evt.target.dataset.id;
    const movie = movies.find((item) => item.imdb_id == movieId);
    console.log(movie)
    if (movie.movie_frame) {
      elModalBox.querySelector(".js-movie-iframe-image").src =
        movie.movie_frame;
    }
    elModalBox.querySelector(".js-movie-modal-title").textContent = movie.title;
    elModalBox.querySelector(".js-movie-text").textContent =
      movie.categories.join(" ");
    elModalBox.querySelector(".js-movie-rating").textContent =
      movie.imdb_rating;
    elModalBox.querySelector(".js-movie-year").textContent = movie.movie_year;
    elModalBox.querySelector(".js-movie-runtime").textContent = (
      movie.runtime / 60
    )
      .toFixed(1)
      .toString()
      .split(".")
      .join(" hours ")
      .concat(" min");
    elModalBox.querySelector(".js-movie-summary").textContent = movie.summary;
    elModalBox.querySelector(
      ".js-movie-imbdb"
    ).href = `https://www.imdb.com/title/${movie.imdb_id}`;
  }
  if (evt.target.classList.contains("js-bookmark")) {
    const id = evt.target.dataset.id;
    const findMovie = movies.find((item) => item.imdb_id == id);
    if(bookmarks.some((item) => item.imdb_id == id)){
      const movieIndex = bookmarks.findIndex((item) => item.imdb_id == id)
      bookmarks.splice(movieIndex, 1)
      evt.target.textContent = "Bookmark"
      handleCounterMovie(bookmarks)
    }else{
      bookmarks = [...bookmarks, findMovie]
      evt.target.textContent = "Delete Bookmark"
      handleCounterMovie(bookmarks)
    }
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks, null, 4))  
    handleCounterMovie(bookmarks)
    handleRenderBookmarkMovies(bookmarks) 
  }
  if(evt.target.classList.contains("js-movie-del")){
    const id = evt.target.dataset.id
    const movieIndex = bookmarks.findIndex((item) => item.imdb_id == id)
    bookmarks.splice(movieIndex, 1)
    handleRenderBookmarkMovies(bookmarks)
    handleRenderMovies(MOVIES)
    handleCounterMovie(bookmarks)
    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarks, null, 4))
  }
};
const handleSub = (evt) => {
  evt.preventDefault();
  const formData = new FormData(evt.target);
  const regex = new RegExp(formData.get("search"), "gi");
  let filterMovies = movies.filter((item) => {
    return (
      (search.value == "" || item.title.match(regex)) &&
      (categorie.value == "all" || item.categories.includes(categorie.value)) &&
      (min.value == "" || item.movie_year >= min.value) &&
      (max.value == "" || item.movie_year <= max.value)
    );
  });
  if (filterMovies.length) {
    if (sort.value !== "") {
      handleRenderMovies(filterMovies.sort(sortObject[sort.value]), regex);
    } else {
      handleRenderMovies(filterMovies, regex);
    }
  }
};


elForm.addEventListener("submit", handleSub);
elList.addEventListener("click", handleClick);
elCanvasBody.addEventListener("click", handleClick)
handleCreateOptions();
handleRenderMovies(MOVIES);
handleRenderBookmarkMovies(bookmarks)
handleCounterMovie()