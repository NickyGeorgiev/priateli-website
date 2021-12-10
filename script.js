
// START CAROUSEL  //

let myIndex = 0;
carousel();

function carousel() {
    let i;
    let x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) { myIndex = 1 }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, 3000); // Change image every 2 seconds
}

// END CAROUSEL  //

//--------------------------------------------------------------------------------//

//  START FILTER  //

$(document).ready(function () {
    $('.filter').click(function () {
        let value = $(this).attr('data-filter');
        if (value == 'menu-restaurant') {
            $('.menu-restaurant').show('1000');
        }
        else {
            $('.menu-restaurant').not('.' + value).hide('1000');
            $('.menu-restaurant').filter('.' + value).show('1000');
        }
    })
})

//  END FILTER  //

//------------------------------------------------------------------------------------/
