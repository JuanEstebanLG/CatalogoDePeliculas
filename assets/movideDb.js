

export const url_basic = 'https://api.themoviedb.org/3/';
export const api_key = '7073007d70c81551b5e373ca85df0495';
export const language = 'es-SP'



export class movieDbFetch{
    
    constructor(url_basic, api_key, language){
        this.url_basic = url_basic;
        this.api_key = api_key;
        this.language = language;
    }

    async movieGeneralFetch(end){
        return await fetch(`${url_basic}movie/${end}?api_key=${api_key}&language=${language}`)
    }

    async movieZoneFetch(page, end){
        return await fetch(`${url_basic}movie/${end}?api_key=${api_key}&page=${page}&language=${language}`);
    }

    async movieTrailerFetch(movieId){
        return await fetch(`${url_basic}movie/${movieId}/videos?api_key=${api_key}&language=${language}`)
    }

    async movieReviewFetch(movieId){
        return await fetch (`${url_basic}movie/${movieId}/reviews?api_key=${api_key}&language=${language}&page=${1}`)
    }

    async movieSearchFetch(movieName){
        return await fetch(`${url_basic}search/movie?api_key=${api_key}&language=${language}&query=${movieName}`)
    }

    async movieCastFetch(movieId){
        return await fetch(`${url_basic}movie/${movieId}/credits?api_key=${api_key}&language=${language}`)
    }
}

