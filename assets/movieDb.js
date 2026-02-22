export const api_base = "/api/tmdb";
export const language = "es-ES";

export class movieDbFetch {
    constructor(apiBase = api_base, defaultLanguage = language) {
        this.apiBase = apiBase;
        this.defaultLanguage = defaultLanguage;

        // Preserve instance context when methods are passed as callbacks.
        this.movieGeneralFetch = this.movieGeneralFetch.bind(this);
        this.movieZoneFetch = this.movieZoneFetch.bind(this);
        this.movieTrailerFetch = this.movieTrailerFetch.bind(this);
        this.movieReviewFetch = this.movieReviewFetch.bind(this);
        this.movieSearchFetch = this.movieSearchFetch.bind(this);
        this.movieCastFetch = this.movieCastFetch.bind(this);
    }

    async movieGeneralFetch(movieId) {
        return fetch(
            `${this.apiBase}/movie/${movieId}?language=${this.defaultLanguage}`
        );
    }

    async movieZoneFetch(page, section) {
        return fetch(
            `${this.apiBase}/movie/${section}?page=${page}&language=${this.defaultLanguage}`
        );
    }

    async movieTrailerFetch(movieId) {
        return fetch(
            `${this.apiBase}/movie/${movieId}/videos?language=${this.defaultLanguage}`
        );
    }

    async movieReviewFetch(movieId) {
        return fetch(
            `${this.apiBase}/movie/${movieId}/reviews?language=${this.defaultLanguage}&page=1`
        );
    }

    async movieSearchFetch(movieName) {
        const query = encodeURIComponent(movieName);
        return fetch(
            `${this.apiBase}/search/movie?language=${this.defaultLanguage}&query=${query}`
        );
    }

    async movieCastFetch(movieId) {
        return fetch(
            `${this.apiBase}/movie/${movieId}/credits?language=${this.defaultLanguage}`
        );
    }
}
