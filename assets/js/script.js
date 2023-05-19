/**
 *
 * @author Hisham Mohamed
 * @website https://embact.com/
 * @description Simple Movie Task Using Javascript And API
 * @linkedIn https://www.linkedin.com/in/hisham--mohamed/
 * @github https://github.com/Embact
 * @copyright All rights reserved to embact.com
 *
 * @api https://api.themoviedb.org/3/
 */

function getAPIUrl(_type, _category, _options = { languages: "en-US", page: 1 }) {
   let api_key = "9d0403807753b1bb674a2c84bf389456";
   let endPoint = "https://api.themoviedb.org/3/";
   let queries = "";
   // Check Page Url
   if (window.location.search != "") {
      _options.page = parseInt(
         window.location.search
            .slice(1)
            .split("&")
            .map((e) => e.split("="))
            .filter((e) => e[0] == "page")[0][1]
      );
   }
   if (Object.keys(_options).length != 0) {
      for (let i = 0; i < Object.keys(_options).length; i++) {
         queries += `&${Object.keys(_options)[i]}=${Object.values(_options)[i]}`;
      }
   } else {
      queries = "";
   }
   // console.log(queries);
   return `${endPoint}${_type}/${_category}/?api_key=${api_key}${queries}`;
}

async function fetchData(_url) {
   let data;
   let response = await fetch(_url);
   if (response.ok) {
      data = await response.json();
   }
   return data;
}

async function buildApp() {
   let slider = document.querySelector(".slider");
   let movieTtile = document.querySelector(".movie-title");
   let rating = document.querySelector(".rating span");
   let starList = document.querySelector(".starList");
   let description = document.querySelector(".description");
   let booking = document.querySelector(".movie-btns");
   let lastClickedVideo = 0;
   let movies = await fetchData(getAPIUrl("movie", "popular"));
   for (let i = 0; i < movies.results.length; i++) {
      let container = document.querySelector(".swiper-wrapper");
      // Build First Movie
      if (i == 0) {
         changeShow(movies.results[i]);
         slider.style.filter = `blur(0px)`;
      }
      container.insertAdjacentHTML(
         "beforeend",
         `
            <div class="swiper-slide movie" data-id='${i}'>
               <div class="slide-info">
                  <div class='slide-movie-info'>
                     <h3>${movies.results[i].title}</h3>
                     <span class='vote_average'>${movies.results[i].vote_average} <i class="fa-solid fa-star"></i></span>
                     ${movies.results[i].adult == true ? `<span class='for-adult'>+18</span>` : ""}
                     <span class='card-description'>${movies.results[i].overview.split(" ").slice(0, 20).join(" ")}...</span>
                  </div>
                  <img src="https://image.tmdb.org/t/p/w400/${movies.results[i].poster_path}" alt="">
               </div>
            </div>
      `
      );
      document.querySelector(`div[data-id="${i}"]`).addEventListener("click", function (e) {
         if (lastClickedVideo != e.currentTarget.dataset.id) {
            changeShow(movies.results[e.currentTarget.dataset.id]);
            lastClickedVideo = e.currentTarget.dataset.id;
         }
      });
   }

   function changeShow(movie) {
      slider.style.filter = `blur(30px)`;
      booking.style.setProperty("display", "none", "important");
      slider.classList.add("animation");
      setTimeout(() => {
         slider.style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')`;
         movieTtile.innerHTML = `
                  <span>${movie.title
                     .split(" ")
                     .slice(0, Math.round(movie.title.split(" ").length / 2))
                     .join(" ")}</span>
                  <span>${movie.title
                     .split(" ")
                     .slice(Math.round(movie.title.split(" ").length / 2))
                     .join(" ")}</span>
         `;
         rating.innerText = movie.vote_average;
         description.innerText = movie.overview;
         // Stars
         starList.innerHTML = `
      <div class='d-flex gap-1 justify-content-center fs-5 mb-2'>
         ${`<i class="fa-solid fa-star"></i>`.repeat(Math.round(movie.vote_average / 2))}
         ${`<i class="fa-regular fa-star"></i>`.repeat(5 - Math.round(movie.vote_average / 2))}
      </div>
      <div>${movie.vote_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} vote</div>
      `;
      }, 500);

      setTimeout(() => {
         slider.style.filter = `blur(0px)`;
         booking.style.setProperty("display", "flex", "important");
         slider.classList.remove("animation");
      }, 1000);
   }
}

let nextPage = document.querySelector(".next-page");
let prevPage = document.querySelector(".previous-page");

nextPage.onclick = function () {
   window.location.search = `?page=${getPageNumber() + 1}`;
};
prevPage.onclick = function () {
   if (getPageNumber() > 1) {
      window.location.search = `?page=${getPageNumber() - 1}`;
   }
};

function getPageNumber() {
   if (window.location.search != "") {
      return parseInt(
         window.location.search
            .slice(1)
            .split("&")
            .map((e) => e.split("="))
            .filter((e) => e[0] == "page")[0][1]
      );
   }
   return 1;
}

document.querySelector(".pageNumber").innerText = getPageNumber();

buildApp();

// let movieName = document.querySelector(".movie-title");
