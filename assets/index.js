// This variable are declared first because is used in the windows load.
let page = 1;

// import elements from modules
import { movieDbFetch } from "./movieDb.js";
import { changeState, loadInner, EspecificMovieFetch, detectMenu, searchMovie}  from "./functions.js";
export const request = new movieDbFetch();


// get elements from html and set variables

export let peliculasContainer = document.getElementById('contenedor');
let searchBar = document.querySelector('input');
let statusItems = 'popular';
let eventsBound = false;
let searchDebounceTimer = null;

// this elements may change the movies order when click over they.

const popular = document.getElementById('popular');
const rated = document.getElementById('rated');
const upcoming = document.getElementById('upcoming');

// this buttons may change the page that required to send a query to api
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');

/**
 * Principal Function, print in screen the api info.
 */

export const cargarPeliculas = async () => {

  try{

    let response = request.movieZoneFetch.bind(request);  // method reference with bound context
    
    // check statusItems variable, this variable is a control for changeState function.

    if(statusItems == 'popular'){
      
      peliculasContainer = await changeState(response, page, peliculasContainer, 'popular', page);
      if (peliculasContainer) {
        loadInner(peliculasContainer.querySelectorAll('.pelicula'));
      }
      setActiveSection('popular');
    }

    if (!eventsBound) {
      bindEvents();
      eventsBound = true;
    }

  } catch(error) {
    console.log(error)
  }
}

function bindEvents() {
  searchBar.addEventListener('input', () => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
      searchMovie(searchBar.value.toLowerCase());
    }, 450);
  });

  popular.addEventListener('click', async () => {
    statusItems = 'popular';
    page = 1;
    setActiveSection('popular');
    await EspecificMovieFetch('popular', request.movieZoneFetch, peliculasContainer, page);
  });

  rated.addEventListener('click', async () => {
    statusItems = 'rated';
    page = 1;
    setActiveSection('rated');
    await EspecificMovieFetch('top_rated', request.movieZoneFetch, peliculasContainer, page);
  });

  upcoming.addEventListener('click', async () => {
    statusItems = 'upcoming';
    page = 1;
    setActiveSection('upcoming');
    await EspecificMovieFetch('upcoming', request.movieZoneFetch, peliculasContainer, page);
  });
}

function setActiveSection(sectionId) {
  [popular, rated, upcoming].forEach((button) => {
    button.classList.toggle('is-active', button.id === sectionId);
  });
}

// declare logic of page-change buttons

btnSiguiente.addEventListener('click', () => {
  if (page < 1000) {
    page += 1;
    detectMenu(statusItems, peliculasContainer, page);

  }
});

btnAnterior.addEventListener('click', () => {
  if (page > 1) {
    page -= 1;
    detectMenu(statusItems, peliculasContainer, page);
  }
});

// instance function.
cargarPeliculas();
