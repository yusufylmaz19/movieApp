let page = 1;
let id=0;
// apı urls
const APIKEY = "56c6bd58be3354c088bd74bc97ababa5";
const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=${page}`;
const IMGPATH = `https://image.tmdb.org/t/p/w1280/`;

// reaching html elements
const images = document.querySelector(".images");
const nextBtn = document.getElementById("next");
const previousBtn = document.getElementById("previous");
const queryEl = document.querySelector(".query");
const searhBtn = document.querySelector(".searchBtn");
const searchInfo = document.getElementById("search-info");
const detailsEl = document.getElementById("movie-details");
const userEl = document.querySelector(".user");
const optionsEl = document.querySelector(".options");

// query value
let qValue;

searhBtn.addEventListener("click", () => {
  page=1;
  search(page);
  searchInfo.innerHTML=`results found for "<span id="query-input">${qValue}</span>"`;
  searchInfo.classList.remove('hide');
});

userEl.addEventListener('click',()=>{
  optionsEl.classList.toggle('hide2');
})



// searching movies
const search = (page) => {
   qValue=queryEl.value;
  if (qValue === null || qValue === "") {
    console.log("you need put something");
  } else {
    searchMovies(qValue,page);
  }
};

// next page button
nextBtn.addEventListener("click", () => {
  images.innerHTML = "";
  page++;
  if (page > 500) {
    page = 1;
  }
  if(searchInfo.classList.contains('hide')){
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=${page}`;
    getPopMovies(URL);
  }else if(searchInfo.classList.contains('genre')){
    const NEWURL= `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=${page}&with_genres=${id}`;
    getPopMovies(NEWURL);
  }
  else{
    search(page);
  }
});

// previous page button
previousBtn.addEventListener("click", () => {
  images.innerHTML = "";
  page--;
  if (page <1) {
    page = 500;
  }
  if(searchInfo.classList.contains('hide')){
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=${page}`;
    getPopMovies(URL);
  }
  else if(searchInfo.classList.contains('genre')){
    const NEWURL= `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=${page}&with_genres=${id}`;
    getPopMovies(NEWURL);
  }
  else{
    search(page);
  }
});


// getting populer movies from apı
const getPopMovies = (url) => {
  fetch(url).then(res=>res.json()).then(data=>{
    showMovies(data);
  })
};


// showing movies  on body
const showMovies = (data) => {
  if (data.results !== null) {
    data.results.forEach((e) => {
      let box = document.createElement("div");
      const { title: t, poster_path: p, vote_average: v, release_date: d ,id:i} = e;

      box.classList.add("box");
      box.innerHTML = `
    <h1 id="title">${t}</h1>
    <button class="savelater" movieID=${i}><i class="fa-solid fa-bookmark"></i></button>
    <img class="all-images" src="${IMGPATH + p}"
    />
    <div class="info">
    <h3 >${d.slice(0, 4)}</h3>
    <h3 class="${setColorRate(v)}">${v}</h3>
    </div>
    <button class="details up"><i class="fa-solid fa-angles-up"></i></button>
    </div>
    `;

      const savelaterEl=box.querySelector('.savelater');
      savelaterEl.addEventListener('click',()=>{
        savelaterEl.classList.toggle('saved');
        if(savelaterEl.classList.contains('saved')){
            console.log(savelaterEl.attributes['movieID'].value);
        }else{
            console.log('you removed this movie on your save list')
        }
      })
      box.addEventListener('click',()=>{
          showDetails(i);
      })
      images.appendChild(box);
    });
  }
  
  else {
    console.log("put some info you idiot");
  }
};


//get searching movies with query 

const searchMovies = (query,page) => {
  images.innerHTML = "";
  const SEARCHURL = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${APIKEY}&page=${page}`;
  fetch(SEARCHURL).then(res=>res.json()).then(data=>{
   data.results.length>0?showMovies(data):whenNoResult();
  })
  
  ;
};

// when result not found
const whenNoResult=()=>{
  searchInfo.innerHTML=`no results found for "<span id="query-input">${qValue}</span>"`

}
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

// enter key trigger
window.addEventListener("keydown", (e) => {
  page=1;
  if (e.key === "Enter") {
    search(page);
    searchInfo.classList.remove('hide');
    searchInfo.innerHTML=`results found for "<span id="query-input">${qValue}</span>"`;
  }
});



// show details about the movie
const showDetails= (movieID)=>{
  const DETAILSURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${APIKEY}&language=en-US`;
  
  fetch(DETAILSURL).then(res=>res.json()).then(data=>{
    

  detailsEl.innerHTML=`<img class="poster"src=${IMGPATH+data.backdrop_path}>  
  <span class="X"><i class="fa-solid fa-xmark"></i></span>
  <form action="casts.html" method="get" target="_blank">
  <input type="hidden" name="id" value=${movieID}>
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

  const li=detailsEl.querySelectorAll(".genres");
  for(let i=0;i<li.length;i++){
    li[i].addEventListener('click',()=>{
      page=1;
      id=li[i].id;
      const NEWURL = `https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=${page}&with_genres=${id}`;
      images.innerHTML="";
      detailsEl.classList.add('hide');
      searchInfo.classList.remove('hide');
      searchInfo.classList.add('genre');
      searchInfo.innerHTML=`we found populer "<span id="query-input">${li[i].innerText}</span>" movies for you`;
      getPopMovies(NEWURL);
    })
  }
})
}


getPopMovies(URL);