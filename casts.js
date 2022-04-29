const APIKEY = "56c6bd58be3354c088bd74bc97ababa5";
const IMGPATH = `https://image.tmdb.org/t/p/w1280/`;

const images = document.querySelector(".images");
const images2 = document.querySelector(".images2");
const title = document.querySelector(".movie-title");
const title2 = document.querySelector(".movie-title2");
const detailsEl = document.getElementById("movie-details");
let movieID = "";

const url = new URL(window.location.href);
movieID = url.searchParams.get("id");

const DETAILSURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${APIKEY}&language=en-US`;

fetch(DETAILSURL)
  .then((resp) => resp.json())
  .then((data) => {
    if (data !== null) {
      title.innerHTML = `"${data.title}"`;
      title2.innerHTML = `"${data.title}"`;
    }
  })
  .catch((err) => {
    console.log("error retrieving data", err);
  });

const CREDITURL = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${APIKEY}&language=en-US`;


fetch(CREDITURL)
  .then((resp) => resp.json())
  .then((data) => {
    if (data !== null) {
      data.cast.forEach((e) => {
        let box = document.createElement("div");
        const { name: n, profile_path: p, character: c, id: i } = e;
        box.classList.add("box");
        box.innerHTML = `
    
    <h1 id="title">${n}<p class="char">${c}</p></h1>
    <img class="all-images" src="${IMGPATH + p}"
    />
    <button class="details up2"><i class="fa-solid fa-angles-up"></i></button>
    </div>
    `;
        box.addEventListener("click", () => {
          showThisPersonMovies(i);
        });

        images.appendChild(box);
      });

      data.crew.forEach((e) => {
        let box = document.createElement("div");
        const { name: n, profile_path: p, job: c , id:i2} = e;
        box.classList.add("box");
        box.innerHTML = `
    
    <h1 id="title">${n}<p class="char">${c}</p></h1>
    <img class="all-images" src="${IMGPATH + p}"
    />
    <button class="details up2"><i class="fa-solid fa-angles-up"></i></button>
    </div>
    `;
    box.addEventListener("click", () => {
      showThisPersonMovies(i2);
    });

        images2.appendChild(box);
      });
    }
  });

const showThisPersonMovies = (castID) => {
  images.innerHTML = "";
  images2.innerHTML = "";
  title2.parentNode.classList.add("hide");
  title.parentNode.classList.add("hide");
  const URL = `https://api.themoviedb.org/3/person/${castID}/movie_credits?api_key=${APIKEY}&language=en-US`;
  fetch(URL).then((resp) =>
    resp.json().then((data) => {
      if (data !== null) {
        data.cast.forEach((e) => {
          let box = document.createElement("div");
          const {
            title: t,
            poster_path: p,
            vote_average: v,
            release_date: d,
            id: i,

          } = e;
          box.classList.add("box");
          box.innerHTML = `
        <h1 id="title">${t}</h1>
        <button class="savelater"><i class="fa-solid fa-bookmark"></i></button>
        <img class="all-images" src="${IMGPATH + p}"
        />
        <div class="info">
        <h3 >${d.slice(0, 4)}</h3>
        <h3 class="${setColorRate(v)}">${v}</h3>
        </div>
        <button class="details up"><i class="fa-solid fa-angles-up"></i></button>
        </div>
        `;

          const savelaterEl = box.querySelector(".savelater");
          savelaterEl.addEventListener("click", () => {
            savelaterEl.classList.toggle("saved");
            if (savelaterEl.classList.contains("saved")) {
              console.log("you save this movie well done!");
            } else {
              console.log("you removed this movie on your save list");
            }
          });
          box.addEventListener("click", () => {
            showDetails(i);
          });
          images.appendChild(box);
        });

        data.crew.forEach((e) => {
          let box = document.createElement("div");
          const {
            title: t,
            poster_path: p,
            vote_average: v,
            release_date: d,
            id: i,

          } = e;
          box.classList.add("box");
          box.innerHTML = `
        <h1 id="title">${t}</h1>
        <button class="savelater"><i class="fa-solid fa-bookmark"></i></button>
        <img class="all-images" src="${IMGPATH + p}"
        />
        <div class="info">
        <h3 >${d.slice(0, 4)}</h3>
        <h3 class="${setColorRate(v)}">${v}</h3>
        </div>
        <button class="details up"><i class="fa-solid fa-angles-up"></i></button>
        </div>
        `;

          const savelaterEl = box.querySelector(".savelater");
          savelaterEl.addEventListener("click", () => {
            savelaterEl.classList.toggle("saved");
            if (savelaterEl.classList.contains("saved")) {
              console.log("you save this movie well done!");
            } else {
              console.log("you removed this movie on your save list");
            }
          });
          box.addEventListener("click", () => {
            showDetails(i);
          });
          images.appendChild(box);
        });
      }
    })
  );
};

// setting rates color
const setColorRate = (vote) => {
  if (vote >= 8) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
};

// show details about the movie
const showDetails= (movieID)=>{
  const DETAILSURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${APIKEY}&language=en-US`;
  
  fetch(DETAILSURL).then(res=>res.json()).then(data=>{
    

  detailsEl.innerHTML=`<img class="poster"src=${IMGPATH+data.backdrop_path}>  
  <span class="X"><i class="fa-solid fa-xmark"></i></span>
  <form action="casts.html" method="get" target="_blank">
  <input class="classified" name="id" value=${movieID}>
  <button type="submit" class="cast-details"><i class="fa-solid fa-circle-info"></i></button>  
  </form>
  <p class="overview">${data.overview}</p>
  <ul class="genresName">
  ${data.genres
    .map(
        (e) => `
<li class="genres" id=${e.id}><a id="genre">${e.name}</a></li>
`
    ).join("")
}
  <ul/>

  `;
  detailsEl.classList.remove('hide');
  
  const closeX = detailsEl.querySelector(".X");
  
  closeX.addEventListener('click',()=>{
    detailsEl.classList.add('hide');
  })

})
}
