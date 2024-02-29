"use strict";
const elForm = document.querySelector(".js-form");
const elcategoriesSelect = elForm.querySelector(".js-categories-select");
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
      ).src = `https://img.youtube.com/vi/${movie.youtube_id}/0.jpg`;
      clone.querySelector(".js-movie-title").textContent =
        typeof movie.title === "string"
          ? movie.title.split(" ").slice(0, 3).join(" ")
          : movie.title;
      clone.querySelector(".js-movie-text").textContent =
        movie.categories.length > 3 ? `${movie.categories.slice(0, 3).join(" ")} ...`: movie.categories.join(", ")
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
        clone.querySelector(".js-more-info").dataset.id = movie.imdb_id
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
    az(a, b){
        if(a.title.toString() < b.title.toString()){
            return -1
        }else{
            return 1
        }
    },
    za(a, b){
        if(a.title.toString() > b.title.toString()){
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
        const movie = MOVIES.find(item => item.imdb_id == movieId)
        console.log(movie)
        elModalBox.querySelector(".js-movie-iframe-image").src = movie.movie_frame;
        elModalBox.querySelector(".js-movie-modal-title").textContent = movie.title   
        elModalBox.querySelector(".js-movie-text").textContent =
        movie.categories.join(" ")
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
  const formData = new FormData(evt.target);
  const regex = new RegExp(formData.get("search"), "gi");
  
  let filterMovies = movies.filter((item) => {
      return (
          (search.value == "" || item.title.match(regex)) && (categorie.value == "all" || item.categories.includes(categorie.value)) && (min.value == "" || item.movie_year > min.value) && (max.value == "" ||  min.value < max.value) 
      )
  });
  if(filterMovies.length){
    if(sort.value !== ""){
      handleRenderMovies(filterMovies.sort(sortObject[sort.value]));
    }else{
      handleRenderMovies(filterMovies)
    }
    console.log(filterMovies)
  }
};
elForm.addEventListener("submit", handleSub);
elList.addEventListener("click", handleClick)
handleCreateOptions();
handleRenderMovies(MOVIES);
