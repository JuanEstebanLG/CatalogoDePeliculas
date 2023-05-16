


const params = new URLSearchParams(window.location.search);

const movieBanner = params.get('banner');
const movieTitle = params.get('title');
const video = params.get('video');
const overview = params.get('overview');
const tagline =  params.get('tagline');
const vote =  params.get('vote');
const cast_object = params.get('cast');
const movieContainer = document.getElementById('contenedor-principal');
const id = params.get('id');

movieContainer.innerHTML = `
<section class = "flex" id="section_1">  

  <div class = "flex" id="mainView_box_container">
    <h1 class = "titulo" id = "title_mainView">${movieTitle}</h1>
    <h3 id = "tagline">${tagline}</h3>
    <div class = "flex" id = "rating_mainView">
      <h3 class = "titulo">Rating</h3>
      <span class = "titulo">${vote}</span>
      <article class = "flex" id = "banner_content">

      <img src="./Media/icons8-coin-96.png"/ alt="Coin Icon Image.">
      
      </article>
    </div>
  </div>
  <div class = "flex" id = "mainMedia_box_container">
    <img id = "movie-banner" src=${movieBanner} alt="Banner of a movie">
  </div>
</section>

<section class = "flex" id="section_2">
  <div id = "overview_container" class = "flex scroll-personal">
    <p id="overview">${overview}</p>
  </div>

  <div id ="trailer_container" class = "flex">
  <iframe  src="https://autoembed.to/movie/tmdb/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  </div>
</section>
<section class = "flex" id = "section_3">
  <h1 class="titulo"> CAST </h1>
  <div class="perfil_zone flex">
  ${cast_object.length > 0 ? cast_object : 'DONT GET CAST, SORRY :[' }
  </div>
</section>
`;
