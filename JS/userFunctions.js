import {doc, setDoc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';
// Initialize Firestore
import {db} from './firebaseConfig.js'

//==============================================================================
// Adding to the watchlist collection in firestore
export async function addToWatchlistFireStore(userID, movieID){
    const userWatchlistDocRef = doc(db, 'watchlist', userID);

    const docSnapshot = await getDoc(userWatchlistDocRef);
    
    if (docSnapshot.exists()) {
        // If the document exists, update it
        await updateDoc(userWatchlistDocRef, {
            movies: arrayUnion(movieID)
        });

    } else {
        // If the document does not exist, create it with the movie ID
        await setDoc(userWatchlistDocRef, {
            movies: [movieID]
        });
    }

}
//==============================================================================

//==============================================================================
// Adding to the favorites collection in firestore
export async function addToFavoritesFireStore(userID, movieID){
    const userFavoriteDocRef = doc(db, 'favorites', userID);

    const docSnapshot = await getDoc(userFavoriteDocRef);
    
    if (docSnapshot.exists()) {
        // If the document exists, update it
        await updateDoc(userFavoriteDocRef, {
            movies: arrayUnion(movieID)
            
        });

    } else {
        // If the document does not exist, create it with the movie ID
        await setDoc(userFavoriteDocRef, {
            movies: [movieID]
        });
    }

}
//==============================================================================

//==============================================================================
// Adding to the watched collection in firestore
export async function addToWatchedFireStore(userID, movieID){
    const userWatchedDocRef = doc(db, 'watched', userID);

    const docSnapshot = await getDoc(userWatchedDocRef);
    
    if (docSnapshot.exists()) {
        // If the document exists, update it
        await updateDoc(userWatchedDocRef, {
            movies: arrayUnion(movieID)
            
        });

    } else {
        // If the document does not exist, create it with the movie ID
        await setDoc(userWatchedDocRef, {
            movies: [movieID]
        });
    }

}
//==============================================================================

//==============================================================================
// Function to remove a movie from a user's watchlist
export async function removeFromWatchlistFireStore(userID, movieID) {
    const userWatchlistDocRef = doc(db, 'watchlist', userID);

    const docSnapshot = await getDoc(userWatchlistDocRef);

    if (docSnapshot.exists()) {
        // If the document exists, update it by removing the movie ID
        await updateDoc(userWatchlistDocRef, {
            movies: arrayRemove(movieID)
        });

    } else {
        // If the document does not exist, log that no action is needed
        console.log(`No watchlist found for user ID ${userID}, nothing to remove.`);
    }
}
//==============================================================================

//==============================================================================
// Function to remove a movie from a user's favorites
export async function removeFromFavoritesFireStore(userID, movieID) {
    const userFavoriteDocRef = doc(db, 'favorites', userID);

    const docSnapshot = await getDoc(userFavoriteDocRef);
    
    if (docSnapshot.exists()) {
        // If the document exists, update it by removing the movie ID
        await updateDoc(userFavoriteDocRef, {
            movies: arrayRemove(movieID)
        });

    } else {
        // If the document does not exist, log that no action is needed
        console.log(`No favorites list found for user ID ${userID}, nothing to remove.`);
    }
}
//==============================================================================

//==============================================================================
// Function to remove a movie from a user's watched
export async function removeFromWatchedFireStore(userID, movieID) {
    const userWatchedDocRef = doc(db, 'watched', userID);

    const docSnapshot = await getDoc(userWatchedDocRef);
    
    if (docSnapshot.exists()) {
        // If the document exists, update it by removing the movie ID
        await updateDoc(userWatchedDocRef, {
            movies: arrayRemove(movieID)
        });

    } else {
        // If the document does not exist, log that no action is needed
        console.log(`No watched list found for user ID ${userID}, nothing to remove.`);
    }
}
//==============================================================================

//==============================================================================
// checking the local storage if watchlist already exists
export function checkLocalStorageForWatchlist() {
    const watchlist = localStorage.getItem('watchlist');
    return watchlist !== null && watchlist !== '';
}
//==============================================================================

//==============================================================================
// checking local storage if favorites already exists
export function checkLocalStorageForFavorites() {
    const favorites = localStorage.getItem('favorite');
    return favorites !== null && favorites !== '';
}
//==============================================================================

//==============================================================================
// checking local storage if watched already exists
export function checkLocalStorageForWatched() {
    const watched = localStorage.getItem('watched');
    return watched !== null && watched !== '';
}
//==============================================================================

//==============================================================================
// Function to get the user's favorites and update the local storage

export async function getFavoritesFireStoreAndUpdateLocalStorage(userID) {
    const userFavoriteDocRef = doc(db, 'favorites', userID);

    // Using .then() and .catch() for error handling
    return getDoc(userFavoriteDocRef)
        .then(docSnapshot => {
            if (docSnapshot.exists()) {
                // If the document exists, get the movies list
                const favoritesData = docSnapshot.data();


                // Update localStorage with the fetched favorites
                localStorage.setItem('favorite', JSON.stringify(favoritesData.movies));
                return favoritesData.movies;
            } else {
                // If the document does not exist, clear and return an empty array

                localStorage.setItem('favorite', JSON.stringify([]));
                return [];
            }
        })
        .catch(error => {
            console.error("Error in fetching or updating favorites:", error);
        });
}

//==============================================================================

//==============================================================================
// Function to get the user's watchlist and update the local storage
export function getWatchlistFireStoreAndUpdateLocalStorage(userID) {
    const userWatchlistDocRef = doc(db, 'watchlist', userID);

    // Using .then() and .catch() for promise handling
    return getDoc(userWatchlistDocRef)
        .then(docSnapshot => {
            if (docSnapshot.exists()) {
                // If the document exists, get the movies list
                const watchlistData = docSnapshot.data();


                // Update localStorage with the fetched watchlist
                localStorage.setItem('watchlist', JSON.stringify(watchlistData.movies));
                return watchlistData.movies;
            } else {
                // If the document does not exist, clear and return an empty array

                localStorage.setItem('watchlist', JSON.stringify([]));
                return [];
            }
        })
        .catch(error => {
            console.error("Error in fetching or updating watchlist:", error);

        });
}

//==============================================================================

//==============================================================================
// Function to get the user's watched and update the local storage
export function getWatchedFireStoreAndUpdateLocalStorage(userID) {
    const userWatchedDocRef = doc(db, 'watched', userID);

    // Using .then() and .catch() for promise handling
    return getDoc(userWatchedDocRef)
        .then(docSnapshot => {
            if (docSnapshot.exists()) {
                // If the document exists, get the movies list
                const watchedData = docSnapshot.data();


                // Update localStorage with the fetched watched
                localStorage.setItem('watched', JSON.stringify(watchedData.movies));
                return watchedData.movies;
            } else {
                // If the document does not exist, clear and return an empty array

                localStorage.setItem('watched', JSON.stringify([]));
                return [];
            }
        })
        .catch(error => {
            console.error("Error in fetching or updating watched:", error);
            // Handle or rethrow the error as needed
        });
}

//==============================================================================



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

    localStorage.setItem('favorite', JSON.stringify(favorite2));
}


export function isInFavorites(movieID) {
    let favorite = getFavorites(); 
    return favorite.includes(movieID);
}

//===============================================================

//===============================================================
// Watched Movies

export function getWatched() {
    let storedWatched = localStorage.getItem('watched');
    if (storedWatched) {
        return JSON.parse(storedWatched);
    } else {
        return [];
    }
}

export function addToWatched(movieID) {
    let watched = getWatched();

    if(watched.includes(movieID) == false){
        watched.push(movieID)
        localStorage.setItem('watched', JSON.stringify(watched))
    }
}


export function removeFromWatched(movieID) {
    let watched = getWatched();
    let watched2 = [];
    watched.forEach(element => {
        if (element != movieID){
            watched2.push(element)
        }
    });

    localStorage.setItem('watched', JSON.stringify(watched2));
}


export function isInWatched(movieID) {
    let watched = getWatched(); 
    return watched.includes(movieID);
}

//===============================================================