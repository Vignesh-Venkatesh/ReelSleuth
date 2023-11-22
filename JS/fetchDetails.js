// importing API Key
import TMDB_API_KEY from "./apiKey.js";

//==============================================================================
// API details
export const apiOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`
    }
};
//==============================================================================

//==============================================================================
// URLs for grabbing images
export const imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';

export const backdropBaseUrl = 'https://image.tmdb.org/t/p/original/';
//==============================================================================

//==============================================================================
// get info on a particular cast member
export async function getCastInfo(castID){
    try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${castID}?language=en-US`, apiOptions)
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const cast = await response.json();
        return cast;
    }
    catch (err) {
        console.error('Fetching error:', err);
    }
}
//==============================================================================


//==============================================================================
// get more info on the particular movie
export async function getMovieDetails(movieID) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, apiOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const movie = await response.json();
        return movie;
        
    } 
    
    catch (err) {
        console.error('Fetching error:', err);
    }
}
//==============================================================================


//==============================================================================
// get movies based off the search query
export async function getMovieSearchDetails(query){
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, apiOptions)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;

    }

    catch (err) {
        console.error('Fetching error:', err);
    }
}
//==============================================================================

//==============================================================================
// Get trending movies for today
export async function getTrendingMoviesDay(option){
    try{
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/${option}?language=en-US`, apiOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;
    }

    catch (err) {
        console.error("Fetching Error:", err)
    }
}
//==============================================================================


//==============================================================================
// get the URL for the movieInfo page
export function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
//==============================================================================


//==============================================================================
// get newly released movies
export async function getNewlyReleasedMovies(region){
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=${region}`, apiOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;
    }
    catch (err){
        console.error("Fetching Error:", err)
    }
}
//==============================================================================


//==============================================================================
// Get the cast list fo a movie
export async function getCastList(movieID){
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/credits?language=en-US`, apiOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response;
    }
    catch (err){
        console.error("Fetching Error:", err)
    }
}
//==============================================================================


//==============================================================================
// get the youtube trailer for the movie
export function youtubeTrailer(movie) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.themoviedb.org/3/movie/${movie}/videos?language=en-US`, apiOptions)
            .then(response => response.json())
            .then(response => {
                let trailer = response.results.find(trailer => 
                    trailer.name.toLowerCase().includes("trailer") || 
                    trailer.name.toLowerCase().includes("teaser")
                );

                if (trailer) {
                    let trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
                    resolve(trailerUrl);
                } else {
                    console.log("No trailer or teaser found.");
                    resolve(null);
                }
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}
//==============================================================================