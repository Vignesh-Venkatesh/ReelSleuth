import { apiOptions, getCastList, getQueryParam, imageBaseUrl,getMovieDetails } from "./fetchDetails.js";

const titleH1 = document.getElementById("title");
const content = document.getElementById("content");
const content2 = document.getElementById("content-2")
const movieId = getQueryParam('movieId');

//==============================================================================
// getting the movie details - movie name
let movie_name;
getMovieDetails(movieId).then(movieName => {
    if (!movieName) {
        console.error("Failed to get movie name");
        return;
    }

    movie_name = movieName.original_title;
    document.title = `Cast/Crew of ${movie_name} | ReelSleuth`

    castActorList();
    crewActorList();
});

//==============================================================================

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
// Getting details of the cast of the particular movie

function castActorList(){


    getCastList(movieId)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.cast.forEach(person => {
            const posterUrl = person.profile_path ? imageBaseUrl + person.profile_path : 'path_to_default_image';

            const cast_h2 = document.querySelector(".cast-h2")
            cast_h2.innerHTML = `Cast of <span>${movie_name}</span>`

            // creating a div that will hold all the cast movie cards
            const cardDiv = document.createElement('div');

            // editing the cast card
            if (posterUrl!="path_to_default_image"){
                cardDiv.innerHTML = `
                
                <a href="castInfo.html?castID=${person.id}" target="_blank">
                <div class="cast-card">
                    <img src="${posterUrl}" alt="${person.original_name}-poster">
                    
                    <div class="character">
                        <h1>${person.original_name}</h1>
                        <p class="character-1"><span>Character:</span></p>
                        <p class="character-2">${person.character}</p>
                    </div>
                </div>
                </a>
                `
                content.appendChild(cardDiv);
                
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
// Getting details of the crew of the particular movie

function crewActorList(){
    

    getCastList(movieId)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.crew.forEach(person => {
            const posterUrl = person.profile_path ? imageBaseUrl + person.profile_path : 'path_to_default_image';

            const crew_h2 = document.querySelector(".crew-h2")
            crew_h2.innerHTML = `Crew of <span>${movie_name}</span>`

            // creating a div that will hold all the cast movie cards
            const cardDiv = document.createElement('div');

            // editing the crew card
            cardDiv.innerHTML = `
                <a href="castInfo.html?castID=${person.id}" target="_blank">
                    <div class="crew-card">                    
                        <div class="crew-info">
                            <h1>${person.original_name}</h1>
                            <p class="department"><span>Department: </span>${person.department}</p>
                            <p class="job"><span>Job: </span>${person.job}</p>
                        </div>
                    </div>
                </a>
                `
            content2.appendChild(cardDiv);
            
        })

    })

    .catch(err => console.error(err))

    // Hide the loader after results display
    .finally(() => {
        hideLoader();  // Hide the loader after the fetch operation is complete
    });
}

//==============================================================================
