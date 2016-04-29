/*
$(document).ready(function(){
    $("#order").click(function(e) {
        console.log("Click order");
        $(".main-content").load("order.html");
    });
});
*/

/* Medium scroll blur effect */
$(window).scroll(function(e) {
    var distanceScrolled = $(this).scrollTop();
    $('#header').css('-webkit-filter', 'blur('+distanceScrolled/60+'px)');

});

