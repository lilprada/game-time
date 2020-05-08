let result = 0;

$('<div>').text(`${result}`).appendTo('.header');


// $('#addButton').click(function() {
//     const inputValue = parseInt($('#myInput').val());
        //add number from total and set it in dom
//     $("#result").text(result + inputValue);

//     $('#myInput').val("");
// });

//cant figure out how to make this add?


$('#subtractButton').click(function() {
    const inputValue = parseInt($('#myInput').val());
    //subtract number from total and set it in dom
    $('#result').text(result - inputValue);

    $('#myInput').val("");
});


$('#addButton').on('click', (event) => {
    const inputValue = parseInt($('#myInput').val());
    $('#result').text(result + inputValue);

    $('#myInput').val("");
})