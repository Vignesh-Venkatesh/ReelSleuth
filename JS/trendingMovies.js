import {getTrendingMoviesDay, imageBaseUrl} from './fetchDetails.js';
import { isInWatchlist, addToWatchlist, removeFromWatchlist, isInFavorites, addToFavorites, removeFromFavorites } from './userFunctions.js';

const titleH1 = document.getElementById("title");
const content = document.getElementById("content");

const selectElement = document.getElementById('trending-movies-select');


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
// initial page setup
document.title = "(Today) Trending Movies | ReelSleuth"
titleH1.innerHTML = `Trending Movies <span>today</span>`;
showLoader();
trendingMoviesToday();


selectElement.addEventListener('change', function(event) {
    // Get the value of the selected option
    const selectedValue = event.target.value;
    if (selectedValue == 'today'){
        content.innerHTML = '';
        titleH1.innerHTML = `Trending Movies <span>Today</span>`;
        document.title = "(Today) Trending Movies | ReelSleuth"
        showLoader();
        trendingMoviesToday();

    }
    
    else if (selectedValue == 'week'){
        content.innerHTML = '';
        titleH1.innerHTML = `Trending Movies <span>This Week</span>`;
        document.title = "(Week) Trending Movies | ReelSleuth"
        showLoader();
        trendingMoviesWeek();

    }

});
//==============================================================================

//==============================================================================
// Fetch trending movies for the week
function trendingMoviesWeek(){
    let ctr = 0;
    getTrendingMoviesDay('week')
    .then(response => response.json())
    .then(data => {
        
        console.log(data)

        // iterating through each result
        data.results.forEach(movie =>{

            // poster url for the movie
            const posterUrl = movie.poster_path ? imageBaseUrl + movie.poster_path : 'path_to_default_image';

            // creating a div that will hold all the trending movie cards
            const cardDiv = document.createElement('div');

            // editing the trending movies card
            cardDiv.innerHTML = `
                <div class="trending-movies-card">
                    <a href="movieInfo.html?movieId=${movie.id}">
                        <img src="${posterUrl}" alt="${movie.title || movie.name}-poster">
                    </a>

                    <div id="misc-buttons">
                        ${checkBookmark(movie.id)}
                    </div>
                </div>

            `
            content.appendChild(cardDiv);
            setupBookmarkToggle(movie.id);
            ctr += 1
        });
        
    })
    .catch(err => console.error(err))

    // Hide the loader after results display
    .finally(() => {
        hideLoader();  // Hide the loader after the fetch operation is complete
    });
}
//==============================================================================

//==============================================================================
// Fetch trending movies for today
function trendingMoviesToday(){
    let ctr = 0;
    getTrendingMoviesDay('day')
    .then(response => response.json())
    .then(data => {
        
        console.log(data)

        // iterating through each result
        data.results.forEach(movie =>{

            // poster url for the movie
            const posterUrl = movie.poster_path ? imageBaseUrl + movie.poster_path : 'path_to_default_image';

            // creating a div that will hold all the trending movie cards
            const cardDiv = document.createElement('div');

            // editing the trending movies card
            cardDiv.innerHTML = `
                <div class="trending-movies-card">
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
            
        });
        

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