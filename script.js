// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();




$(window).on('load', function () {
    $('.menu-filters li a').click(function () {
        $('.menu-filters li a').removeClass('filter');
        $(this).addClass('filter');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".clearfix").isotope({
        itemSelector: ".menu-restaurant",
        percentPosition: false,
        masonry: {
            columnWidth: ".menu-restaurant"
        }
    })
});

// nice select
$(document).ready(function() {
    $('select').niceSelect();
  });

/** google_map js **/
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.712775, -74.005973),
        zoom: 18,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}