//wish i had been able to display a timer that counted down
//also wish i had been able to make it so that 'movie' and 'selections' divs didnt shift downwards each time the 'results' text pops
//how to make it so background doesnt tile?
//game breaks if you just click through 'next question' to the end without answering anything - not sure why!

let movie;
let movies;
let answers;
var score = 0;
var strikes = 0;
const usedMovieIds = [];
let timerCounter = 0;
let timer;
let answerSelected = false;

const $scoreboard = $('<div>').text(score).appendTo($('#points'));
const $missBoard = $('<div>').text(strikes).appendTo($('#points'));
// let $posterDiv = $('.movie').html(`<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"><p>${movie.overview}</p>`);

const $winModal = $('#end-game');
const $lossModal = $('#lose-game');

//function to make effects happen on load items when "start" is clicked (if no movie, have these animations - as not to repeat every time the start button is clicked)

function initiateQuestion() {
    if (!movie) {
        $('#descrip').fadeOut(100);
        var curr_font_size = $('.title').css('font-size');
        var new_font_size = parseFloat(curr_font_size) - 150;
        $('.title').animate({fontSize: new_font_size}, 1000);
        $('#points').css("display", "flex")
            .hide()
            .fadeIn(1000);
    }   

    //random movie generator from array - pushes tmpMovie (movie displayed during question) to an array called usedMovieIds

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
     
    //resets timer/answer options/"results" (i.e. 'correct', 'incorrect' upon pressing Next Question button)

    clearPreviousData();
    populateAnswers();
    resetAndStartTimer();

    let $posterDiv = $('.movie').html(`<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"><p>${movie.overview}</p>`);

    blurMoviePoster(20);
    $('.light').fadeOut(2000);
}

//blurs movie poster, sourced from stackoverflow

function blurMoviePoster(size) {
    var filterVal = 'blur(' + size + 'px)';
     $(".movie img").css({
       'filter':filterVal,
       'webkitFilter':filterVal,
       'mozFilter':filterVal,
       'oFilter':filterVal,
       'msFilter':filterVal,
       'transition':'all 0.5s ease-out',
       '-webkit-transition':'all 0.5s ease-out',
       '-moz-transition':'all 0.5s ease-out',
       '-o-transition':'all 0.5s ease-out'
   });

}

//shuffles array of movies at random

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//upon clicking an answer, the timer is stopped, the movie is unblurred and the answer is revealed.

function handleAnswerClick(clickedAnswer) {
    clearInterval(timer);
    blurMoviePoster(0);

    if (answerSelected) {
        return;
    }

    //the tmpMovie is always assigned a class of 'correct'
    $(".selections").find(`li:contains("${movie.title}")`).addClass("correct");

    if(clickedAnswer === movie.title) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer(clickedAnswer);
    }

    answerSelected = true;

    //as long as score is not equivalent to 10 or strikes are not equivalent to 3, button reads 'next question'
    if (strikes !== 3 && score !== 10) {
        $('#start-btn').text('NEXT QUESTION');
    }
}

//if no answer is selected, the info is still cleared

function clearPreviousData() {
    $(".selections").html("");
    $('#info').html("");
    answerSelected = false;
}

//function to handle response if incorrect answer is selected
    //text response, strikes +1
    //if strikes reach 3, loss modal pops

function handleIncorrectAnswer(clickedAnswer) {
    $('<div>').attr('id', 'incorrect').text('Wrong! IDiot!').appendTo('#info');
    if (clickedAnswer) {
        $(".selections").find(`li:contains("${clickedAnswer}")`).addClass("incorrect");
    }
    $('<div>').attr('id', 'answer').text(`it's ${movie.title}, Lol yikes`).appendTo($('#info'));
    strikes += 1;
    $missBoard.text(strikes);

    if (strikes === 3) {
        $lossModal.css('display', 'block');
    }
}

//function to handle response if correct answer is selected
    //text response, score +1
    //if score = 10, win modal pops

function handleCorrectAnswer() {
    $('<div>').attr('id', 'correct').text('Correct!').appendTo('#info');
    score += 1;
    $scoreboard.text(score);

    if (score === 10) {
        $winModal.css('display', 'block');
    }
}

//function to assign incorrect answers to other 3 choices -  if selected answer does not equal movie title, send it back to answers array to be used again (only movies being sent to usedMovieIds will not be displayed again in question). 
    
function populateAnswers() {
    answers = [];

    while(answers.length < 3) {
        const tmpIncorrectMovie = movies[Math.floor(Math.random() * movies.length)];

        if (!answers.includes(tmpIncorrectMovie.title) && tmpIncorrectMovie.title !== movie.title) {
            answers.push(tmpIncorrectMovie.title);
        }
    }
    //pushes movie.title to answers regardless so that it can be used as answer optino
    answers.push(movie.title);
    shuffleArray(answers);

    //turns li into clickable buttons (click, event)
    answers.forEach((answer) => {
        const $button = $('<li>').text(answer);
        $button.on('click', (event) => {
            handleAnswerClick(answer);
        });

        $('.selections').append($button);
    })
}

//function to reset/start 10s timer, and what happens if timer runs out (blur vanishes, correct answer is highlighted, incorrectanswer function is called [strikes +1, 'incorrect' response pops])

function resetAndStartTimer() {
    clearInterval(timer);
    timerCounter = 0;

    timer = setInterval(function() {
        timerCounter++;

        const amountToBlur = (-1 * (timerCounter / 10) + 1) * 20;
        blurMoviePoster(amountToBlur);

        if (timerCounter === 10) {
            clearInterval(timer);
            
            $(".selections").find(`li:contains("${movie.title}")`).addClass("correct");
            handleIncorrectAnswer();
            answerSelected = true;
        }
    }, 1000);
}

//api for tmdb - trending movies of the week

$.ajax({
    url: "https://api.themoviedb.org/3/trending/movie/week?api_key=0f56884bfabe1fe77e2440f8a73e73ee",
    type: "GET",
}).then((response) => {
    movies = response.results;
});

//click start button to call on initiateQuestion function
$( "#start-btn" ).click(function() {
    initiateQuestion();
});

//restart button within modals, resets scores and also performs initiateQuestion function
$(".restart-btn").click(function() {
    $winModal.css('display', 'none');
    $lossModal.css('display', 'none');

    score = 0;
    strikes = 0;
    $scoreboard.text(score);
    $missBoard.text(strikes);

    initiateQuestion();
});
