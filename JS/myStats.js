import { getWatchlist, getFavorites, isInFavorites, isInWatchlist, addToFavorites, addToWatchlist, removeFromFavorites, removeFromWatchlist } from "./userFunctions.js";
import { getMovieDetails, imageBaseUrl } from "./fetchDetails.js";


//==========================================================
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
//==========================================================


const content = document.getElementById("content");

//==========================================================
// Setting up toggle functionality and event listeners for `My Favorites` and  `My Watchlist` buttons
const favoritesBtn = document.getElementById("my-favorites-btn")
const watchlistBtn = document.getElementById("my-watchlists-btn")

favoritesBtn.addEventListener("click", () => {
    toggleOnFavoritesBtnStyle();
    toggleOffWatchlistBtnStyle();
    displayFavorites();
})

watchlistBtn.addEventListener("click", () => {
    toggleOffFavoritesBtnStyle();
    toggleOnWatchlistBtnStyle();
    displayWatchlist();  
})

function toggleOnFavoritesBtnStyle(){
    favoritesBtn.style.border = "2px solid white"
    favoritesBtn.style.color = "#3b3a3b"
    favoritesBtn.style.background ="#ff9935";
}

function toggleOnWatchlistBtnStyle(){
    watchlistBtn.style.border = "2px solid white"
    watchlistBtn.style.color = "#3b3a3b"
    watchlistBtn.style.background ="#ff9935";
}

function toggleOffFavoritesBtnStyle(){
    favoritesBtn.style.border = "2px solid transparent"
    favoritesBtn.style.color = "#a6a5a6b"
    favoritesBtn.style.background ="#100f11";
}

function toggleOffWatchlistBtnStyle(){
    watchlistBtn.style.border = "2px solid transparent"
    watchlistBtn.style.color = "#a6a5a6b"
    watchlistBtn.style.background ="#100f11";
}
//==========================================================


//==========================================================
// By default calling the `My Favorites` button
toggleOnFavoritesBtnStyle();
toggleOffWatchlistBtnStyle();
displayFavorites()
//==========================================================

//==============================================================================
// Displaying the user's favorite movies
function displayFavorites(){
    console.log(getFavorites())
    content.innerHTML = ''
    getFavorites().forEach(movieID => {
        let ctr = 0;
        getMovieDetails(movieID)
        .then(movie =>{

            console.log(movie)
            const posterUrl = movie.poster_path ? imageBaseUrl + movie.poster_path : 'path_to_default_image';
            // creating a div that will hold all the newly released movie cards
            const cardDiv = document.createElement('div');

            // editing the newly released movies card
            if (posterUrl!="path_to_default_image"){
                cardDiv.innerHTML = `
                    <div class="favorites-movies-card">
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
        .catch(err => console.error(err))

        // Hide the loader after results display
        .finally(() => {
            hideLoader();  // Hide the loader after the fetch operation is complete
        });
    })
}

//==============================================================================
// Displaying the user's watchlist
function displayWatchlist(){
    console.log(getWatchlist())
    content.innerHTML = ''
    getWatchlist().forEach(movieID => {
        let ctr = 0;
        getMovieDetails(movieID)
        .then(movie =>{

            console.log(movie)
            const posterUrl = movie.poster_path ? imageBaseUrl + movie.poster_path : 'path_to_default_image';
            // creating a div that will hold all the newly released movie cards
            const cardDiv = document.createElement('div');

            // editing the newly released movies card
            if (posterUrl!="path_to_default_image"){
                cardDiv.innerHTML = `
                    <div class="watchlist-movies-card">
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
        .catch(err => console.error(err))

        // Hide the loader after results display
        .finally(() => {
            hideLoader();  // Hide the loader after the fetch operation is complete
        });
    })
}
//==============================================================================


//==========================================================
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
//==========================================================


//==========================================================
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
//==========================================================