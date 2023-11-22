import {getMovieDetails, imageBaseUrl, backdropBaseUrl, getQueryParam, apiOptions, youtubeTrailer, getCastInfo} from './fetchDetails.js';
import {auth} from './firebaseConfig.js';
import {onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';



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

showLoader()
//==============================================================================

//==============================================================================
// Displaying the cast Info
const castID = getQueryParam('castID'); // Grabbing the movieID
castInfo(castID)

function castInfo(castID){
    getCastInfo(castID)
    .then(cast => {

        if (cast.profile_path == null){
            
            const backdrop_div = document.getElementById("backdrop")
            backdrop_div.src = "Assets/Images/sad-film-reel.png"

            const noResultFoundDiv = document.createElement("div")
            noResultFoundDiv.className = "no-result-found-div"

            noResultFoundDiv.innerHTML =  `
                <img src="Assets/Images/sad-film-reel.png" alt="Not Found">
                <p>No results found</p>
            `

            document.body.appendChild(noResultFoundDiv);
        }

        else{
            document.title = `${cast.name} | ReelSleuth`

            const imageURL = cast.profile_path ? imageBaseUrl + cast.profile_path : 'path_to_default_image';

            
            // backdrop of the page
            const backdrop_div = document.getElementById("backdrop")
            backdrop_div.src = backdropBaseUrl+cast.profile_path

            // Information of the cast
            const castInfoDiv = document.createElement("div")
            castInfoDiv.className = "cast-info-div"

            castInfoDiv.innerHTML = `
                                        <img src="${imageURL}" alt="${cast.name} image">
                                        <div class="further-info">
                                            <h2>${cast.name}</h2>
                                            <div class="misc-info-1">
                                                ${displayMiscDetails(cast)} 
                                            </div>
                                            <div class="biography">
                                                <p>${cast.biography}</p>
                                            </div>
                                        </div>
                                        ` ;
            content.appendChild(castInfoDiv);
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
// Getting details such as if the api call result has a birthdate, deathdate and place of birth
function displayMiscDetails(cast){
    let final_element = ``;
    if (cast.birthday != null){
        final_element +=  `<p><span>Born: </span>${cast.birthday}</p>`;
    }
    if (cast.deathday != null){
        final_element += `<p><span>Death: </span>${cast.deathday}</p>`;
    }
    if (cast.place_of_birth != null){
        final_element += `<p><span>Place of birth: </span>${cast.place_of_birth}</p>`;
    }
    if (cast.biography != ""){
        final_element += `<hr/>`
    }

    return final_element;
}
//==============================================================================