import { movieDbFetch } from "../movieDb.js";

const newRequest = new movieDbFetch();

export async function throwPopular(page = 1) {
    return newRequest.movieZoneFetch(page, "popular");
}


