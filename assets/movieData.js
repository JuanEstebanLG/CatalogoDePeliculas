


const params = new URLSearchParams(window.location.search);
const movieBanner = params.get('banner');
const movieTitle = params.get('title');
const video = params.get('video');
const overview = params.get('overview');
const tagline =  params.get('tagline');
const vote =  params.get('vote');


const movieContainer = document.getElementById('contenedor-principal');



movieContainer.innerHTML = `
<section class = "flex" id="section_1">  

  <div class = "flex" id="mainView_box_container">
    <h1 class = "titulo" id = "title_mainView">${movieTitle}</h1>
    <h3 id = "tagline">${tagline}</h3>
    <div class = "flex" id = "rating_mainView">
      <h3 class = "titulo">Rating</h3>
      <span class = "titulo">${vote}</span>
      <article class = "flex" id = "banner_content">

      <img src="./Media/icons8-coin-96.png"/ alt="${movieTitle} image principal">
      
      </article>
    </div>
  </div>
  <div class = "flex" id = "mainMedia_box_container">
    <img id = "movie-banner" src=${movieBanner}>
  </div>
</section>

<section class = "flex" id="section_2">
  <div id = "overview_container" class = "flex scroll-personal">
    <p id="overview">${overview}</p>
  </div>

  <div id ="trailer_container" class = "flex">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/${video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  </div>
</section>
`;



// https://secure.gravatar.com/avatar/992eef352126a53d7e141bf9e8707576.jpg

