import {getMovieDetails, imageBaseUrl, backdropBaseUrl, getQueryParam, apiOptions, youtubeTrailer} from './fetchDetails.js';
import {auth} from './firebaseConfig.js';
import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';

//==========================================================
// Checking if user is logged in or logged out
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        console.log("User logged in:", user);
    } else {
        // User is logged out
        window.location.href = "./authenticate.html"
    }
});
//==========================================================

const content = document.getElementById("content");

//==============================================================================
// loader
const loader = document.getElementById('loader');

function showLoader() {
    loader.style.display = 'block';
    content.style.display = 'none';
}

function hideLoader() {
    loader.style.display = 'none';
    content.style.display = 'flex';
}

showLoader()
//==============================================================================

//==============================================================================
// Get the particular movie's info
const movieId = getQueryParam('movieId'); // Grabbing the movieID
movieInfo(movieId)

function movieInfo(movieID){
    getMovieDetails(movieID)
    .then(movie => {
        
        if (movie.success == false){
            console.log("OH NO")
        }

        else{

            document.title = `${movie.title || movie.name || movie.original_title} | ReelSleuth`
            
            // If movie exists
            document.title = `${movie.title || movie.name || movie.original_title} | ReelSleuth`
            
            // constructing the poster URL
            const posterUrl = movie.poster_path ? imageBaseUrl + movie.poster_path : 'path_to_default_image';

            // backdrop of the page
            const backdrop_div = document.getElementById("backdrop")
            backdrop_div.src = backdropBaseUrl+movie.backdrop_path

            // Information of the movie
            const movieInfoDiv = document.createElement("div")
            movieInfoDiv.className = "movie-info-div"

            movieInfoDiv.innerHTML = `
                                        <img src="${posterUrl}" alt="${movie.title} poster">
                                        <div class="further-info">
                                            <h2>${movie.title || movie.name || movie.original_title}</h2>

                                            <hr/>
                                            <p>${movie.overview}</p>
                                            <div class="misc-info-1">
                                                ${movieReleased(movie)} 
                                            </div>
                                            <div class="misc-info-2">
                                                <p><span>Genre: </span>${displayGenre(movie)}</p>
                                            </div>
                                            <div class="misc-info-3">
                                                <a href="index.html"><button>Home</button></a>
                                                <a href="castList.html?movieId=${movie.id}"><button>Cast</button></a>
                                            </div>
                                        </div>
                                        ` ;
            content.appendChild(movieInfoDiv);

            // Continuing the trailer button
            let trailerButton = document.createElement('a');
            trailerButton.target = "_blank";
            let trailerButtonHTML = `<button type="button">Trailer</button>`;
            trailerButton.innerHTML = trailerButtonHTML;
            movieInfoDiv.querySelector(".misc-info-3").appendChild(trailerButton);

            // Asynchronously set the href when the URL is available
            youtubeTrailer(movie.id).then(trailerUrl => {
                if (trailerUrl) {
                    trailerButton.href = trailerUrl;
                } else {
                    let innerButton = trailerButton.querySelector('button');
                    innerButton.style.width = "200px";

                    innerButton.textContent = "No Trailer Available";
                }
            });
        }
        

    })
    .catch(err => console.error(err))

    // Hide the loader after results display
    .finally(() => {
        hideLoader();  // Hide the loader after the fetch operation is complete
    });
}
//==============================================================================

//==============================================================================
// fetching the genres of the film
function displayGenre(movie){

    if (movie.genres.len >= 1){
        return movie.genres.name
    }
    else{
        let l="";
        movie.genres.forEach(element => {

            l = l+element.name+", "
        });
        return l.slice(0,-2);
    }
}
//==============================================================================

//==============================================================================
// Checking if the movie released
function movieReleased(movie){
    if (movie.status == "Released"){
        let vote_average = movie.vote_average
        if(movie.vote_average == 0){
            vote_average = 'N/A'
        }
        return `<p><span>Rating: </span>${vote_average}</p>
        <p><span>Runtime: </span>${movie.runtime} minutes</p>
        <p><span>Release Year: </span>${movie.release_date.slice(0,4)}</p>`
    }
    else{
        return `<p><span>Release Date: </span>${movie.release_date}</p>`
    }
}
//==============================================================================