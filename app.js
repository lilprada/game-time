let movie;
let movies;
let answers;
const usedMovieIds = [];

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function populateAnswers() {
    answers = [];

    while(answers.length < 3) {
        const tmpIncorrectMovie = movies[Math.floor(Math.random() * movies.length)];

        if (!answers.includes(tmpIncorrectMovie.title) && tmpIncorrectMovie.title !== movie.title) {
            answers.push(tmpIncorrectMovie.title);
        }
    }

    answers.push(movie.title);
    shuffleArray(answers);

    answers.forEach((answer) => {
        const $buttons = $('<li>').text(answer);
        $('.selections').append($buttons);
    });
}

$.ajax({
    url: "https://api.themoviedb.org/3/trending/movie/week?api_key=0f56884bfabe1fe77e2440f8a73e73ee",
    type: "GET",
}).then((response) => {
    movies = response.results;
});

$( "#start-btn" ).click(function() {
    if (!movies.length) { return; }
    movie = null;

    const totalMovies = movies.length;

    while (!movie) {
        const tmpMovie = movies[Math.floor(Math.random() * movies.length)];
        if (!usedMovieIds.includes(tmpMovie.id)) {
            movie = tmpMovie;
            usedMovieIds.push(tmpMovie.id);
        }    
    }

    populateAnswers();

    // let $posterDiv = $('.movie').html(`<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"><p>${movie.overview}</p>`);
    // 
});
