import { getMovieDetails, imageBaseUrl } from "./fetchDetails.js";
import {auth} from './firebaseConfig.js';
import { getWatchlist, getFavorites, getWatched, isInWatchlist, addToWatchlist, removeFromWatchlist, isInFavorites, addToFavorites, removeFromFavorites, isInWatched, addToWatched, removeFromWatched } from './userFunctions.js';
import { addToWatchlistFireStore, addToFavoritesFireStore,  addToWatchedFireStore, removeFromFavoritesFireStore, removeFromWatchlistFireStore, removeFromWatchedFireStore, getFavoritesFireStoreAndUpdateLocalStorage, getWatchlistFireStoreAndUpdateLocalStorage, getWatchedFireStoreAndUpdateLocalStorage, checkLocalStorageForFavorites, checkLocalStorageForWatchlist, checkLocalStorageForWatched } from './userFunctions.js';
import {onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';


//==========================================================
// Checking if user is logged in or logged out
let userID;
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        userID = user.uid
        console.log("User logged in:", user.uid);

        if (checkLocalStorageForFavorites() == false){

            getFavoritesFireStoreAndUpdateLocalStorage(userID) // fetch db reset Favorites local storage
        }
        if (checkLocalStorageForWatchlist() == false){

            getWatchlistFireStoreAndUpdateLocalStorage(userID) // fetch db reset Watchlist local storage
        }
        if (checkLocalStorageForWatched() == false){

            getWatchedFireStoreAndUpdateLocalStorage(userID) // fetch db reset Watchlist local storage
        }

    } else {
        // User is logged out
        window.location.href = "./authenticate.html"
    }
});
//==========================================================

//==========================================================
// Logout
const logoutBtn = document.getElementById("logout-btn")
logoutBtn.addEventListener("click", ()=>{
    signOut(auth)
    .then(() => {
        window.location.href = "./authenticate.html"
    })
    .catch((error) => {
        console.error(error.message)
    })
})
//==========================================================

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
const watchedBtn = document.getElementById("my-watched-btn")

favoritesBtn.addEventListener("click", () => {
    toggleOnFavoritesBtnStyle();
    toggleOffWatchlistBtnStyle();
    toggleOffWatchedBtnStyle();
    displayFavorites();
})

watchlistBtn.addEventListener("click", () => {
    toggleOffFavoritesBtnStyle();
    toggleOnWatchlistBtnStyle();
    toggleOffWatchedBtnStyle();
    displayWatchlist();  
})

watchedBtn.addEventListener("click", () => {
    toggleOffFavoritesBtnStyle();
    toggleOffWatchlistBtnStyle();
    toggleOnWatchedBtnStyle();
    displayWatched();  
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

function toggleOnWatchedBtnStyle(){
    watchedBtn.style.border = "2px solid white"
    watchedBtn.style.color = "#3b3a3b"
    watchedBtn.style.background ="#ff9935";
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

function toggleOffWatchedBtnStyle(){
    watchedBtn.style.border = "2px solid transparent"
    watchedBtn.style.color = "#a6a5a6b"
    watchedBtn.style.background ="#100f11";
}
//==========================================================


//==========================================================
// By default calling the `My Favorites` button
toggleOnFavoritesBtnStyle();
toggleOffWatchlistBtnStyle();
toggleOffWatchedBtnStyle();
displayFavorites();
//==========================================================

//==============================================================================
// Displaying the user's favorite movies
function displayFavorites(){

    content.innerHTML = ''
    getFavorites().forEach(movieID => {
        let ctr = 0;
        getMovieDetails(movieID)
        .then(movie =>{


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
                            ${checkWatched(movie.id)}
                            ${checkFavorites(movie.id)}
                            ${checkBookmark(movie.id)}
                        </div>
                    </div>
                `
                content.appendChild(cardDiv);
                setupWatchedToggle(movie.id);
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

    content.innerHTML = ''
    getWatchlist().forEach(movieID => {
        let ctr = 0;
        getMovieDetails(movieID)
        .then(movie =>{


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
                            ${checkWatched(movie.id)}
                            ${checkFavorites(movie.id)}
                            ${checkBookmark(movie.id)}
                        </div>
                    </div>
                `
                content.appendChild(cardDiv);
                setupWatchedToggle(movie.id);
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

//==============================================================================
// Displaying the user's watched
function displayWatched(){

    content.innerHTML = ''
    getWatched().forEach(movieID => {
        let ctr = 0;
        getMovieDetails(movieID)
        .then(movie =>{

            const posterUrl = movie.poster_path ? imageBaseUrl + movie.poster_path : 'path_to_default_image';
            // creating a div that will hold all the newly released movie cards
            const cardDiv = document.createElement('div');

            // editing the newly released movies card
            if (posterUrl!="path_to_default_image"){
                cardDiv.innerHTML = `
                    <div class="watched-movies-card">
                        <a href="movieInfo.html?movieId=${movie.id}">
                            <img src="${posterUrl}" alt="${movie.title || movie.name}-poster">
                        </a>

                        <div id="misc-buttons">
                            ${checkWatched(movie.id)}
                            ${checkFavorites(movie.id)}
                            ${checkBookmark(movie.id)}
                        </div>
                    </div>
                `
                content.appendChild(cardDiv);
                setupWatchedToggle(movie.id);
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

//==============================================================================
// Checking if movie is watched or not
function setupWatchedToggle(movieID) {
    const onIcon = document.getElementById(`watched-on-${movieID}`);
    const offIcon = document.getElementById(`watched-off-${movieID}`);

    onIcon.addEventListener('click', () => {
        onIcon.style.display = 'none';
        offIcon.style.display = 'flex';
        removeFromWatchedFireStore(userID, movieID);
        removeFromWatched(movieID);
    });
    

    offIcon.addEventListener('click', () => {
        offIcon.style.display = 'none';
        onIcon.style.display = 'flex';
        
        addToWatchedFireStore(userID, movieID)
        addToWatched(movieID)
    });
}
function checkWatched(movieID){
    if (isInWatched(movieID)){
        return `
            <i class="fa-solid fa-eye" id="watched-on-${movieID}"></i>
            <i class="fa-regular fa-eye-slash" id="watched-off-${movieID}" style="display: none;"></i>
        `
    }
    else{
        return `
            <i class="fa-solid fa-eye" id="watched-on-${movieID}" style="display: none;"></i>
            <i class="fa-regular fa-eye-slash" id="watched-off-${movieID}"></i>
        `
    }
}
//==============================================================================


//==========================================================
// Checking if movie is favorited or not
function setupFavoriteToggle(movieID) {
    const onIcon = document.getElementById(`favorite-on-${movieID}`);
    const offIcon = document.getElementById(`favorite-off-${movieID}`);

    onIcon.addEventListener('click', () => {
        onIcon.style.display = 'none';
        offIcon.style.display = 'flex';
        removeFromFavoritesFireStore(userID, movieID);
        removeFromFavorites(movieID);
    });
    

    offIcon.addEventListener('click', () => {
        offIcon.style.display = 'none';
        onIcon.style.display = 'flex';
        
        addToFavoritesFireStore(userID, movieID)
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

    onIcon.addEventListener('click', () => {
        onIcon.style.display = 'none';
        offIcon.style.display = 'flex';
        removeFromWatchlistFireStore(userID, movieID)
        removeFromWatchlist(movieID)
    });

    offIcon.addEventListener('click', () => {
        offIcon.style.display = 'none';
        onIcon.style.display = 'flex';
        
        addToWatchlistFireStore(userID, movieID)
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