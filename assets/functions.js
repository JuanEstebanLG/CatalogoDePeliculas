import { movieDbFetch, url_basic, api_key, language } from "./movideDb.js";
import { cargarPeliculas, peliculasContainer, request } from "./index.js";

const poster_url = "https://image.tmdb.org/t/p/w500/"; // prefix for any img catch from api.

/**
 *  This function should change the state of 'peliculasContainer' and pull the movies according to
 * the request that is being executed.
 */

export async function changeState(mode, page, peliculasContainers, section) {
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

export function indexGen(data) {
    let pelicula = "";
    data.results.forEach((peliculas) => {
        if (
            peliculas.backdrop_path != null ||
            peliculas.backdrop_path != undefined
        ) {
            pelicula += `
            <figure class='pelicula'>
                <img class='poster' src='${poster_url}${peliculas.poster_path}' id='${peliculas.id}'/>
                <h3 class='titulo'>${peliculas.title}</h3>
            </figure>
        `;
        }
    });
    return pelicula;
}

/**
 * this function read the data from the api request to catch the trailer of especific movie
 */

export function indexVideo(data) {
    const video = data.results.find(
        (videos) => videos.type == "Trailer" && videos.official == true
    );
    const videoSrc = video ? video.key : "";
    //catch de video key for youtube.
    return videoSrc;
}

export function indexDetails(data) {
    if (Array.isArray(data)) {
        let arrayDetails = "";
        for (let i = 0; i < data.genre.length; i++) {
            arrayDetails += `,${data.genre[i]}`;
        }
        return arrayDetails;
    }
}

/*
* this function is active when the user click on a banner movie. transport to another page when de movie info
*/

export async function openWindowMaker(
    banner,
    title,
    videoSrc,
    overview,
    tagline,
    vote,
    cast,
    id
) {
    if (videoSrc) {
        return openWindow(
            `./movie-description.html?banner=${banner.src}&title=${title.innerHTML
            }&video=${videoSrc}&overview=${overview}&tagline=${tagline}&vote=${vote}&cast=${encodeURIComponent(
                cast
            )}&id=${id}`
        );
    } else {
        await makeAndCloseAlert(
            peliculasContainer,
            "This movie is either very old or too new and lacks visual elements"
        );
        return await openWindow(
            `./movie-description.html?banner=${banner.src}&title=${title.innerHTML
            }&video=${videoSrc}&overview=${overview}&tagline=${tagline}&vote=${vote}&cast=${encodeURIComponent(
                cast
            )}&id=${id}`
        );
    }
}


/**
 * 
 * This function get a url and return a promise, if the url is valid, resolve is instanced, if not, reject is instanced
 */
function openWindow(url) {
    return new Promise((resolve, reject) => {
        const newWindow = window.open(url);
        if (newWindow) {
            resolve(newWindow);
        } else {
            reject(new Error("No se pudo abrir la ventana"));
        }
    });
}


/**
 * 
 * @param {*} contenedor 
 * @param {*} texto 
 * @returns 
 * This finction get two params container, String and make  alert in html at the container, the String is the text of this alert
 */
function makeAndCloseAlert(contenedor, texto) {
    // Make alert
    return new Promise((resolve) => {
        const new_alert = document.createElement("section");

        const principal_space = document.createElement("div");
        const text = document.createElement("p");
        const button = document.createElement("button");

        const button_text = document.createTextNode("ACCEPT AND CONTINUE");
        const content = document.createTextNode(texto);

        contenedor.appendChild(new_alert);

        text.appendChild(content);
        button.appendChild(button_text);
        principal_space.appendChild(text);
        principal_space.appendChild(button);
        new_alert.appendChild(principal_space);

        button.classList.add("button_close_alert");
        text.classList.add("text_alert");
        principal_space.classList.add("alert_text_container");
        new_alert.classList.add("alerta", "justify_and_aling_style");
        new_alert.style.display = "grid";
        new_alert.style.position = "fixed";

        const NEW_ALERT_DOM_ELEMENT = document.getElementsByClassName("alerta")[0];
        const BUTTON_DOM_ELEMENT =
            document.getElementsByClassName("button_close_alert")[0];

        BUTTON_DOM_ELEMENT.addEventListener("click", () => {
            NEW_ALERT_DOM_ELEMENT.remove();
            resolve();
        });
    });
}

/**
 * 
 * @param {*} dataFetch 
 * @returns 
 * This function receives a JSON file, searches it for the "name" and "profile_path" properties. 
 * If found, it retrieves the first 5 results and generates a key-value object, then returns it.
 * If it doesn't find these instances, it returns an empty object.
 */
export async function getCast(dataFetch) {
    let CAST = {};
    let container = peliculasContainer;
    try {
        for (let i = 0; i <= 4; i++) {
            CAST[dataFetch.cast[i].name] = dataFetch.cast[i].profile_path;
        }
        return CAST;
    } catch {
        await makeAndCloseAlert(
            container,
            "Sorry, we dont get cast or other visual elements for this movie"
        );
        return CAST;
    }
}

/**
 * 
 * @param {*} cast 
 * @returns 
 * This function receives a cast object generated by the getCast() function and creates a string that emulates an HTML structure. 
 * using the keys and values from the object, then returns it.
 */
export function extendCast(cast) {
    let profiles = "";
    if (cast != null || cast != undefined) {
        const keys = Object.keys(cast);
        const values = Object.values(cast);

        for (let i = 0; i < keys.length; i++) {
            if (values[i] != null) {
                profiles += `
        <article class = "cast_profile flex">
            <img class = "profile_image" src = "${poster_url}${values[i]}"/>
            <h3 class = "profile_name flex"> ${keys[i]}</h3>
        </article>
            `;
            }
        }
        return profiles;
    } else {
        profiles += `

    `;
        return profiles;
    }
}

/**
 * This function checks if the response obtained from the api is valid, if it is, it saves everything in a json
 * if not, send an error depending on what happened
 */

export async function Validate(dataFetch) {
    let response = "";
    if (dataFetch.ok) {
        response = dataFetch.json();
    } else {
        console.log("Ha ocurrido un problema.");
        if (dataFetch.status == 401) {
            console.log("LLave de ingreso incorrecta");
        }
    }
    return response;
}

/**
 *
 * this function load the movie info, use the openWindowMaker for open other page.
 */

export function loadInner(movieContainers) {
    movieContainers.forEach((movieContainer) => {
        const banner = movieContainer.getElementsByClassName("poster")[0];
        const title = movieContainer.getElementsByClassName("titulo")[0];
        const id = banner.id;

        banner.addEventListener("click", async () => {
            const responseTrailer = await request.movieTrailerFetch(id);
            const responseDetails = await request.movieGeneralFetch(id);
            const responseCast = await request.movieCastFetch(id);

            const data_details = await Validate(responseDetails);
            const data_trailer = await Validate(responseTrailer);
            const data_cast = await Validate(responseCast);
            console.log(data_cast.cast.length);
            const cast = await getCast(data_cast);
            const cast_extend = extendCast(cast);
            const videoSrc = indexVideo(data_trailer, peliculasContainer, id);

            const genreSrc = indexDetails(data_details.genre);

            const tag = data_details.tagline;
            const overview = data_details.overview;
            const vote = data_details.vote_average;
            const vote_round = round(vote);
            const responseReviews = await request.movieReviewFetch(id);
            const data_reviews = await Validate(responseReviews);
            openWindowMaker(
                banner,
                title,
                videoSrc,
                overview,
                tag,
                vote_round,
                cast_extend,
                id
            );
        });
    });
}

// this function just round a number.
function round(number) {
    return parseFloat(number).toFixed(1);
}

/**
 * this function change the order of movies deppend of a 'section' variable.
 */
export async function EspecificMovieFetch(
    section,
    movieFetch,
    peliculasContainer,
    page
) {
    try {
        console.log(page);
        let response = movieFetch;
        peliculasContainer = await changeState(
            response,
            page,
            peliculasContainer,
            section
        );
        const movieContainers = peliculasContainer.querySelectorAll(".pelicula");
        loadInner(movieContainers);
    } catch (error) {
        console.log(error);
    }
}

/**
 * this function detect the menu thats print in screen, use this information for change page of container.
 */
export function detectMenu(menu, peliculasContainer, page) {
    switch (menu) {
        case "popular":
            EspecificMovieFetch(
                "popular",
                request.movieZoneFetch,
                peliculasContainer,
                page
            );
            break;
        case "rated":
            EspecificMovieFetch(
                "top_rated",
                request.movieZoneFetch,
                peliculasContainer,
                page
            );
            break;
        case "upcoming":
            EspecificMovieFetch(
                "upcoming",
                request.movieZoneFetch,
                peliculasContainer,
                page
            );
            break;
    }
}

export async function searchMovie(texto) {
    if (texto != "") {
        const search_fetch = await request.movieSearchFetch(texto);
        const data_search = await Validate(search_fetch);
        let NEW_GENERATION_MOVIES = "";
        data_search.results.forEach((search) => {
            if (search.poster_path != null && search.video != null) {
                NEW_GENERATION_MOVIES += `
            <div class='pelicula'>
                <img class='poster' src='${poster_url}${search.poster_path}' id='${search.id}'/>
                <h3 class='titulo'>${search.title}</h3>
            </div>
            `;
                return NEW_GENERATION_MOVIES;
            }
        });

        if (NEW_GENERATION_MOVIES != null) {
            peliculasContainer.innerHTML = NEW_GENERATION_MOVIES;
            loadInner(peliculasContainer.querySelectorAll(".pelicula"));
        }
    } else {
        cargarPeliculas();
    }
}
