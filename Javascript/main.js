"use strict";
const elForm = document.querySelector(".js-form");
const elCategoriesSelect = elForm.querySelector(".js-categories-select");
const elTemplateMovieItem =
  document.querySelector(".js-movie-template").content;
const elList = document.querySelector(".movies__list");
const elModalBox = document.querySelector(".js-movie-modal")
const MOVIES = movies.slice(0, 30);
const handleRenderMovies = (arr) => {
  if (arr?.length) {
    const elFragment = document.createDocumentFragment();
    elList.innerHTML = "";
    for (const movie of arr) {
      const clone = elTemplateMovieItem.cloneNode(true);
      clone.querySelector(".movies__item").dataset.id = movie.imdb_id
      clone.querySelector(
        ".js-movie-image"
      ).src = `https://img.youtube.com/vi/${movie.ytid}/0.jpg`;
      clone.querySelector(".js-movie-title").textContent =
        typeof movie.Title === "string"
          ? movie.Title.split(" ").slice(0, 3).join(" ")
          : movie.Title;
      clone.querySelector(".js-movie-text").textContent =
        movie.Categories.split("|").slice(0, 3).join(", ");
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
        clone.querySelector(".js-more-info").dataset.id = movie.imdb_rating
      elFragment.appendChild(clone);
    }
    elList.append(elFragment);
  }
};
const handleFilterCategories = (arr) => {
  let result = [];
  for (const movie of arr) {
    const categories = movie.Categories.split("|");
    for (const categorie of categories) {
        if (!result.includes(categorie)) {
          result.push(categorie);
        }
    }
  }

  return result;
};
const handleCreateOptions = () => {
  const categories = handleFilterCategories(movies);
  const fragmentOptions = document.createDocumentFragment();
  if (categories?.length) {
    for (const categorie of categories) {
      const newOption = document.createElement("option");
      newOption.value = categorie;
      newOption.textContent = categorie;
      fragmentOptions.appendChild(newOption);
    }
    elCategoriesSelect.appendChild(fragmentOptions);
  }
};
const sortObject = {
    az(a, b){
        if(a.Title.toString() < b.Title.toString()){
            return -1
        }else{
            return 1
        }
    },
    za(a, b){
        if(a.Title.toString() > b.Title.toString()){
            return -1
        }else{
            return 1
        }
    },
    ["old-year"](a, b){
        if(a.movie_year < b.movie_year){
            return -1
        }else{
            return 1
        }
    },
    ["new-year"](a, b){
        if(a.movie_year > b.movie_year){
            return -1
        }else{
            return 1
        }
    },
}
const handleClick = (evt) => {
    console.log(evt.target)
    if(evt.target.matches(".js-more-info")){
        const movieId = evt.target.dataset.id;
        const movie = MOVIES.find(item => item.imdb_rating == movieId)
        console.log(movie)
        elModalBox.querySelector(".js-movie-iframe-image").src = `https://img.youtube.com/vi/${movie.ytid}/0.jpg`;
        elModalBox.querySelector(".js-movie-modal-title").textContent = movie.Title   
        elModalBox.querySelector(".js-movie-text").textContent =
        movie.Categories.split("|").slice(0, 3).join(", ");
      elModalBox.querySelector(".js-movie-rating").textContent = movie.imdb_rating;
      elModalBox.querySelector(".js-movie-year").textContent = movie.movie_year;
      elModalBox.querySelector(".js-movie-runtime").textContent = (
        movie.runtime / 60
      ).toFixed(1)
        .toString()
        .split(".")
        .join(" hours ")
        .concat(" min");
        elModalBox.querySelector(".js-movie-summary").textContent = movie.summary
        elModalBox.querySelector(".js-movie-imbdb").href = `https://www.imdb.com/title/${movie.imdb_id}`
    
    }
}
const handleSub = (evt) => {
  evt.preventDefault();
  let filter = [];
  const formData = new FormData(evt.target);
  const regex = new RegExp(formData.get("search"), "gi");
  if (formData.get("categorie") == "all") {
    filter = MOVIES;
  } else {
    filter = MOVIES.filter((item) => item.Categories.split("|").includes(formData.get("categorie"))
    );
    console.log(filter)
  }
  if (formData.get("search")){
    filter = filter.filter((item) => item.Title?.toString()?.match(regex));
  }
  if (formData.get("sort")) {
    filter = filter.sort(sortObject[formData.get("sort")])    
  }
  handleRenderMovies(filter);
};
elForm.addEventListener("submit", handleSub);
elList.addEventListener("click", handleClick)
handleCreateOptions();
handleRenderMovies(MOVIES);
