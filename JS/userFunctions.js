//==============================================================================
// WatchList Functions
export function getWatchlist() {
    let storedWatchlist = localStorage.getItem('watchlist');
    if (storedWatchlist) {
        return JSON.parse(storedWatchlist);
    } else {
        return []; // Return an empty array if 'watchlist' doesn't exist
    }
}


export function addToWatchlist(movieID) {
    let watchlist = getWatchlist();

    console.log(watchlist)

    if(watchlist.includes(movieID) == false){
        watchlist.push(movieID)
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }
}


export function removeFromWatchlist(movieID) {
    let watchlist = getWatchlist();
    let watchlist2 = [];
    watchlist.forEach(element => {
        if (element != movieID){
            watchlist2.push(element)
        }
    });

    // watchlist = watchlist.filter(id => id !== movieID);
    localStorage.setItem('watchlist', JSON.stringify(watchlist2));
}


export function isInWatchlist(movieID) {
    let watchlist = getWatchlist(); 
    return watchlist.includes(movieID);
}
//===============================================================

//===============================================================
// Favorite Movies

export function getFavorites() {
    let storedFavorite = localStorage.getItem('favorite');
    if (storedFavorite) {
        return JSON.parse(storedFavorite);
    } else {
        return [];
    }
}

export function addToFavorites(movieID) {
    let favorite = getFavorites();

    console.log(favorite)

    if(favorite.includes(movieID) == false){
        favorite.push(movieID)
        localStorage.setItem('favorite', JSON.stringify(favorite))
    }
}


export function removeFromFavorites(movieID) {
    let favorite = getFavorites();
    let favorite2 = [];
    favorite.forEach(element => {
        if (element != movieID){
            favorite2.push(element)
        }
    });

    // watchlist = watchlist.filter(id => id !== movieID);
    localStorage.setItem('favorite', JSON.stringify(favorite2));
}


export function isInFavorites(movieID) {
    let favorite = getFavorites(); 
    return favorite.includes(movieID);
}

//===============================================================