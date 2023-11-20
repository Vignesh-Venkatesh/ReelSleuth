import {getMovieSearchDetails, getNewlyReleasedMovies, imageBaseUrl} from './fetchDetails.js';
import { isInWatchlist, addToWatchlist, removeFromWatchlist, isInFavorites, addToFavorites, removeFromFavorites } from './userFunctions.js';

const titleH1 = document.getElementById("title");
const content = document.getElementById("content");


//==============================================================================
// Loader
const loader = document.getElementById('loader');
function showLoader() {
    loader.style.display = 'block';
    content.style.display = 'none';
}
function hideLoader() {
    loader.style.display = 'none';
    content.style.display = 'flex';
}
//==============================================================================

//==============================================================================
// Displaying Newly Released Movies - based on country
const selectElement = document.getElementById('region-select');
selectElement.addEventListener('change', function(event) {
    // Get the value of the selected option
    const selectedValue = event.target.value;
    displayNewMovies(selectedValue)

});
displayNewMovies('US')
function displayNewMovies(region){
    showLoader();
    titleH1.innerHTML = `Newly Released Movies - <span>${selectElement.options[selectElement.selectedIndex].text}</span>`;
    let ctr = 0;
    getNewlyReleasedMovies(region)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        content.innerHTML = ''

        if (data.results.length == 0){
            const cardDiv = document.createElement('div');
            cardDiv.innerHTML = 
                `
                <h2>No results found</h2>
                `
            content.appendChild(cardDiv);
        }

        data.results.forEach(movie => {// poster url for the movie
            const posterUrl = movie.poster_path ? imageBaseUrl + movie.poster_path : 'path_to_default_image';

            // creating a div that will hold all the newly released movie cards
            const cardDiv = document.createElement('div');

            // editing the newly released movies card
            if (posterUrl!="path_to_default_image"){
                cardDiv.innerHTML = `
                    <div class="search-movies-card">
                        <a href="movieInfo.html?movieId=${movie.id}">
                            <img src="${posterUrl}" alt="${movie.title || movie.name}-poster">
                        </a>

                        <div id="misc-buttons">
                            ${checkFavorites(movie.id)}
                            ${checkBookmark(movie.id)}
                        </div>
                    </div>
                `
                content.appendChild(cardDiv);
                setupFavoriteToggle(movie.id);
                setupBookmarkToggle(movie.id);
                ctr += 1
            }
        })
    })
    .catch(err => console.error(err))

    // Hide the loader after results display
    .finally(() => {
        hideLoader();  // Hide the loader after the fetch operation is complete
    });
}
//==============================================================================


//==============================================================================
// Displaying the user searched results
document.getElementById('searchButton').addEventListener('click', function() {
    searchMovies();
});
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchMovies();
    }
});
function searchMovies(){
    showLoader()

    // Hide the region select
    const regionSelectDiv = document.querySelector(".region-div")
    regionSelectDiv.style.display = "none"

    let query = document.getElementById('searchInput').value;
    titleH1.innerHTML = `Search Results for <span>${query}</span>`;
    if (query.trim() === ''){
        titleH1.innerHTML = ""
    };

    let ctr = 0;
    getMovieSearchDetails(query)
    .then(response => response.json())
    .then(data => {
        content.innerHTML = ''
        console.log(data)

        if (data.results.length == 0){
            const cardDiv = document.createElement('div');
            cardDiv.innerHTML = `
                <h2>No results found</h2>
                `
            content.appendChild(cardDiv);
        }

        data.results.forEach(movie => {
            // poster url for the movie
            const posterUrl = movie.poster_path ? imageBaseUrl + movie.poster_path : 'path_to_default_image';

            // creating a div that will hold all the search movie cards
            const cardDiv = document.createElement('div');

            // editing the search movies card
            if (posterUrl!="path_to_default_image"){
                cardDiv.innerHTML = `
                    <div class="search-movies-card">
                        <a href="movieInfo.html?movieId=${movie.id}">
                            <img src="${posterUrl}" alt="${movie.title || movie.name}-poster">
                        </a>
                    
                        <div id="misc-buttons">
                            ${checkFavorites(movie.id)}
                            ${checkBookmark(movie.id)}
                        </div>
                    </div>

                `
                content.appendChild(cardDiv);
                setupFavoriteToggle(movie.id);
                setupBookmarkToggle(movie.id);
                ctr += 1
            }
        })
    })
    .catch(err => console.error(err))

    // Hide the loader after results display
    .finally(() => {
        hideLoader();  // Hide the loader after the fetch operation is complete
    });
}
//==============================================================================


//==============================================================================
// Checking if movie is favorited or not
function setupFavoriteToggle(movieID) {
    const onIcon = document.getElementById(`favorite-on-${movieID}`);
    const offIcon = document.getElementById(`favorite-off-${movieID}`);

    onIcon.addEventListener('click', function() {
        this.style.display = 'none';
        offIcon.style.display = 'flex';
        removeFromFavorites(movieID)
    });

    offIcon.addEventListener('click', function() {
        this.style.display = 'none';
        onIcon.style.display = 'flex';
        addToFavorites(movieID)
    });
}
function checkFavorites(movieID){
    if (isInFavorites(movieID)){
        return `
            <i class="fa-solid fa-heart" id="favorite-on-${movieID}"></i>
            <i class="fa-regular fa-heart" id="favorite-off-${movieID}" style="display: none;"></i>
        `
    }
    else{
        return `
            <i class="fa-solid fa-heart" id="favorite-on-${movieID}" style="display: none;"></i>
            <i class="fa-regular fa-heart" id="favorite-off-${movieID}"></i>
        `
    }
}
//==============================================================================

//==============================================================================
// Checking if movie is bookmarked or not
function setupBookmarkToggle(movieID) {
    const onIcon = document.getElementById(`watchlist-on-${movieID}`);
    const offIcon = document.getElementById(`watchlist-off-${movieID}`);

    onIcon.addEventListener('click', function() {
        this.style.display = 'none';
        offIcon.style.display = 'flex';
        removeFromWatchlist(movieID)
    });

    offIcon.addEventListener('click', function() {
        this.style.display = 'none';
        onIcon.style.display = 'flex';
        addToWatchlist(movieID)
    });
}
function checkBookmark(movieID){
    if (isInWatchlist(movieID)){
        return `
            <i class="fa-solid fa-bookmark" id="watchlist-on-${movieID}"></i>
            <i class="fa-regular fa-bookmark" id="watchlist-off-${movieID}" style="display: none;"></i>
        `
    }
    else{
        return `
            <i class="fa-solid fa-bookmark" id="watchlist-on-${movieID}" style="display: none;"></i>
            <i class="fa-regular fa-bookmark" id="watchlist-off-${movieID}"></i>
        `
    }
}
//==============================================================================