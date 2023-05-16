// This variable are declared first because is used in the windows load.
let page = 1;

// import elements from modules
import { movieDbFetch, url_basic, api_key, language } from "./movideDb.js";
import { changeState, loadInner, EspecificMovieFetch, detectMenu, searchMovie}  from "./functions.js";
export const request = new movieDbFetch(url_basic,api_key,page,language);


// get elements from html and set variables

export let peliculasContainer = document.getElementById('contenedor');
let searchBar = document.querySelector('input');
let statusItems = 'popular';

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

    let response = request.movieZoneFetch;  // create a new instance of class moviePopularFetch;
    
    // check statusItems variable, this variable is a control for changeState function.

    if(statusItems == 'popular'){
      
      peliculasContainer = await changeState(response, page, peliculasContainer, 'popular', page);
      loadInner(peliculasContainer.querySelectorAll('.pelicula'))
    }

    searchBar.addEventListener('input', () => {
      searchMovie(searchBar.value.toLowerCase())
    })
    // add event click to all buttons

    popular.addEventListener('click', async () =>{
      statusItems = 'popular';
      page = 1;
      await EspecificMovieFetch('popular', request.movieZoneFetch, peliculasContainer, page)
      });

    rated.addEventListener('click', async () => {
      statusItems = 'rated';
      page = 1;
        await EspecificMovieFetch('top_rated', request.movieZoneFetch, peliculasContainer, page)
    });

    upcoming.addEventListener('click', async () => {
      statusItems = 'upcoming';
      page = 1;
      await EspecificMovieFetch('upcoming', request.movieZoneFetch, peliculasContainer, page)
    });




  } catch(error) {
    console.log(error)
  }
}

// declare logic of page-change buttons

btnSiguiente.addEventListener('click', () => {
  if (page < 1000) {
    page += 1;
    detectMenu(statusItems, peliculasContainer, page);
    cargarPeliculas();

  }
});

btnAnterior.addEventListener('click', () => {
  if (page > 1) {
    page -= 1;
    detectMenu(statusItems, peliculasContainer, page);
    cargarPeliculas();
  }
});

// instance function.
cargarPeliculas();