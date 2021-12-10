
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('buy-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}
    var indexIncrement = document.getElementsByClassName('index')

function purchaseClicked() {
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    var txt;
  if (confirm("Потвърдете, че желаете да направите поръчката")) {
    txt = alert('В момента услугата за онлайн поръчки е в процес на разработка. Извиняваме се за неудобството и работим по оптимизирането на сайта :)');
  } else {
    txt = "Вие отказахте поръчката си!";
  }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('menu-title')[0].innerText
    var price = shopItem.getElementsByClassName('menu-price')[0].innerText
    addItemToCart(title, price)
    updateCartTotal()
}

function addItemToCart(title, price) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        // if (cartItemNames[i].innerText == title) {
        //     alert('This item is already added to the cart')
        //     return
        // }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger cart-quantity-button" type="button">X</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = total + ' лв.'
    document.getElementsByClassName('index')[0].innerText = i
}



// $(document).ready(function(){
//     $('.buy-button').on('click', function () {
//         var cart = $('.cart-button');
//         var imgtodrag = $(this).parent('.buy-button').find("i").eq(0);
//         if (imgtodrag) {
//             var imgclone = imgtodrag.clone()
//                 .offset({
//                 "top": imgtodrag.offset().top,
//                 "left": imgtodrag.offset().left
//             })
//                 .css({
//                 'opacity': '0.8',
//                     'position': 'absolute',
//                     'height': '150px',
//                     'width': '150px',
//                     'z-index': '100'
//             })
            
//             setTimeout(function () {
//                 cart.effect("shake", {
//                     times: 2
//                 }, 200);
//             }, 1500);

//             imgclone.animate({
//                 'width': 0,
//                     'height': 0
//             }, function () {
//                 $(this).detach()
//             });
//         }
//     });    
// })