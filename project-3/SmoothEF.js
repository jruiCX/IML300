$(document).ready(function() {
    
    $("body").css("display", "none").fadeIn(2000);

    $("#userInput").focus(function() {
        $(this).animate({
            width: "600px",      
            opacity: 1,          
            borderWidth: "2px"
        }, 500);
    });

    $("#userInput").blur(function() {
        $(this).animate({
            width: "400px",     
            opacity: 0.7,
            borderWidth: "1px"
        }, 500);
    });

});