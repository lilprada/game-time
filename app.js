/////////////COMMENT THRU THIS TMR TO PREP FOR PRESENTATION, STYLING!

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

    clearPreviousData();
    populateAnswers();
    resetAndStartTimer();

    let $posterDiv = $('.movie').html(`<img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"><p>${movie.overview}</p>`);

    blurMoviePoster(20);
    $('.light').fadeOut(2000);
}

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

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function handleAnswerClick(clickedAnswer) {
    clearInterval(timer);
    blurMoviePoster(0);

    if (answerSelected) {
        return;
    }

    $(".selections").find(`li:contains("${movie.title}")`).addClass("correct");

    if(clickedAnswer === movie.title) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer(clickedAnswer);
    }

    answerSelected = true;

    if (strikes !== 3 && score !== 10) {
        $('#start-btn').text('NEXT QUESTION');
    }
}

function clearPreviousData() {
    $(".selections").html("");
    $('#info').html("");
    answerSelected = false;
}

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

function handleCorrectAnswer() {
    $('<div>').attr('id', 'correct').text('Correct!').appendTo('#info');
    score += 1;
    $scoreboard.text(score);

    if (score === 10) {
        $winModal.css('display', 'block');
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
        const $button = $('<li>').text(answer);
        $button.on('click', (event) => {
            handleAnswerClick(answer);
        });

        $('.selections').append($button);
    })
}

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

$.ajax({
    url: "https://api.themoviedb.org/3/trending/movie/week?api_key=0f56884bfabe1fe77e2440f8a73e73ee",
    type: "GET",
}).then((response) => {
    movies = response.results;
});

$( "#start-btn" ).click(function() {
    initiateQuestion();
});

$(".restart-btn").click(function() {
    $winModal.css('display', 'none');
    $lossModal.css('display', 'none');

    score = 0;
    strikes = 0;
    $scoreboard.text(score);
    $missBoard.text(strikes);

    initiateQuestion();
});
