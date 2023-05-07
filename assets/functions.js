import { movieDbFetch, url_basic, api_key, language } from "./movideDb.js";
import { peliculasContainer, request} from "./index.js";



const poster_url = 'https://image.tmdb.org/t/p/w500/'; // prefix for any img catch from api.

/**
 *  This function should change the state of 'peliculasContainer' and pull the movies according to
 * the request that is being executed.
 */

export async function changeState(mode, page, peliculasContainers, section){

    // the mode variable, is the especific method instance from movieDbFetch class.
    try {
        let end = section;
        let response = await mode(page, end);
        let data = await Validate(response);
        let peliculaHtml = indexGen(data);
        peliculasContainers.innerHTML = peliculaHtml;
        return peliculasContainers;
      } catch (error) {
        console.log(error);
      }
}

/**
 * 
 * this function send new division and elements to HTML
 */

export function indexGen(data){

    
    let pelicula = '';
    data.results.forEach(peliculas => {
        pelicula +=
        `
            <div class='pelicula'>
                <img class='poster' src='${poster_url}${peliculas.poster_path}' id='${peliculas.id}'/>
                <h3 class='titulo'>${peliculas.title}</h3>
            </div>
        `;
    });
    return pelicula;
}

/**
 * this function read the data from the api request to catch the trailer of especific movie 
 */

export function indexVideo(data){


    const video = data.results.find( 
        (videos) =>  videos.type == 'Trailer' && videos.official == true
        );
    const videoSrc = video ? video.key : ''; //catch de video key for youtube.
    return videoSrc;

}


export function indexDetails(data){
    
    if(Array.isArray(data)){
        let arrayDetails = ''
        for(let i = 0; i < data.genre.length; i++){
            arrayDetails += `,${data.genre[i]}`
        }
        return arrayDetails;
    }
}

/*
* this function is active when the user click on a banner movie. transport to another page when de movie info
*/
export  function openWindowMaker(banner, title, videoSrc, overview, tagline, vote){
    if(videoSrc){
    // only can activated if VideoSrc exist.
        return window.open(`./movie-description.html?banner=${banner.src}&title=${title.innerHTML}&video=${videoSrc}&overview=${overview}&tagline=${tagline}&vote=${vote}`)
    }else{
        alert('Esta pelicula no cuenta con trailer ni Media definida para tu lenguaje o idioma, intenta cambiar a otro idioma porfavor')
        return window.open(`./movie-description.html?banner=${banner.src}&title=${title.innerHTML}&video=${videoSrc}&overview=${overview}&tagline=${tagline}&vote=${vote}`)
    }
}


/**
 * This function checks if the response obtained from the api is valid, if it is, it saves everything in a json
 * if not, send an error depending on what happened
 */
export async function Validate(dataFetch){

    let response = '';
    if(dataFetch.ok){
    response =  dataFetch.json();
    }else{
    console.log('Ha ocurrido un problema.')
        if(dataFetch.status == 401){
            console.log('LLave de ingreso incorrecta')
        }
    }
    return  response;
}

/**
 * 
 * this function load the movie info, use the openWindowMaker for open other page.
 */
export function loadInner(movieContainers){

    movieContainers.forEach((movieContainer) => {
    const banner = movieContainer.getElementsByClassName('poster')[0];
    const title = movieContainer.getElementsByClassName('titulo')[0];
    const id = banner.id;

    banner.addEventListener('click',  async () =>  {

        const responseTrailer =  await request.movieTrailerFetch(id);
        const responseDetails = await request.movieGeneralFetch(id);

        const data_trailer = await Validate(responseTrailer); 
        const data_details = await Validate(responseDetails);
        console.log(data_details);

        const videoSrc = indexVideo(data_trailer);
        const genreSrc = indexDetails(data_details.genre);

        const tag = data_details.tagline
        const overview = data_details.overview;
        const vote = data_details.vote_average;

        console.log(tag, overview, vote);

        const responseReviews =  await request.movieReviewFetch(id)
        const data_reviews = await Validate(responseReviews);
        openWindowMaker(banner, title, videoSrc, overview, tag, vote);
        })
    });
}
/**
 * this function change the order of movies deppend of a 'section' variable.
 */
export async function EspecificMovieFetch(section, movieFetch, peliculasContainer, page){
    try{

        
        console.log(page)
        let response = movieFetch;
        peliculasContainer = await changeState(response, page, peliculasContainer, section);
        const movieContainers = peliculasContainer.querySelectorAll('.pelicula');
        loadInner(movieContainers);
    }catch(error){
        console.log(error)
    }
}


/**
 * this function detect the menu thats print in screen, use this information for change page of container.
 */
export function detectMenu(menu, peliculasContainer, page){
switch(menu){
    case 'popular':
        EspecificMovieFetch('popular', request.movieZoneFetch, peliculasContainer, page)
        break;
    case 'rated':
        EspecificMovieFetch('top_rated', request.movieZoneFetch, peliculasContainer, page)
        break;
    case 'upcoming':
        EspecificMovieFetch('upcoming', request.movieZoneFetch, peliculasContainer, page)
        break;
    
    }
} 
