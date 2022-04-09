
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

// ----------------- add, remove, change quantity cart element global func -----------------//

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-delete')
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

// ----------------- final purchase -----------------//

function purchaseClicked() {

    if (confirm("Потвърдете, че желаете да направите поръчката")) {
        var result = ''
        let total =0;
        let n = document.getElementsByClassName('cart-items')[0].children
        for (let i = 0; i < n.length; i++) {
            let name = n[i].children[0].textContent.trim();
            let quantity = n[i].children[2].children[0].value;
            let price = n[i].children[1].textContent.substring(0,4);
            result+=`${quantity} x ${name} - ${price} ##### `
            total += Number(quantity)*Number(price);
        }
        result+=` ТОТАЛ: ${(total + 1.99).toFixed(2)} лв. ##### `
        sendEmail(result);
    } else {
        txt = "Вие отказахте поръчката си!";
    }
    updateCartTotal()
}

// ----------------- email send -----------------//

function sendEmail(result) {
    let clientFirstName = document.getElementById('first').value;
    let clientLastName = document.getElementById('last').value;
    let clientTel = document.getElementById('tel').value;
    let adress = document.getElementById('address').value;
    let adressNumber = document.getElementById('adress-number').value;
    let blok = document.getElementById('blok').value;
    let vhod = document.getElementById('vhod').value;
    let dopalnitelno = document.getElementById('dopalnitelno').value;
    let forSend = `${result}
    Име: ${clientFirstName} ${clientLastName}, Тел.: ${clientTel}, 
    Ул.: ${adress}, №: ${adressNumber}, бл.: ${blok}, вх.: ${vhod} ##### АЛЕРГЕНИ: ${dopalnitelno} #####`
    Email.send({
      Host: "smtp.gmail.com",
      Username: "n.georrgiev@gmail.com",
      Password: "nervaoubyqnlrugf",
      To: 'priateli@abv.bg',
      From: "n.georrgiev@gmail.com",
      Subject: "НОВА ПОРЪЧКА!",
      Body: forSend,
    })
      .then(function (message) {
        alert("Очаквайте поръчката си до 90 минути")
    });
    console.log(forSend);
    alert('Вашата поръчка беше направена успешно!')
    document.location.reload(true)
}


// ----------------- remove cart element single func -----------------//

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

// ----------------- quantuty change single func -----------------//

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

// ----------------- add to cart single func -----------------//

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('menu-title')[0].innerText
    var price = shopItem.getElementsByClassName('menu-price')[0].innerText
    addItemToCart(title, price)
    updateCartTotal()
}

// ----------------- add item to cart -----------------//

function addItemToCart(title, price) {
    let section = document.getElementById('cart')
    let check = document.getElementsByClassName('cart-row').length
    if(check >0){
        section.style.display='block'
    }
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    qty = 1;
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].textContent == title) {
            let inc = document.getElementsByClassName('cart-quantity-input')
            inc[i].value = Number(inc[i].value) + 1;
            return;
        }
    }
    var cartRowContents = `
    <div class="cart-item cart-column">
    <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value='1'>
    <button class="btn-delete cart-quantity-button" type="button">X</button>
    </div>`

    cartRow.innerHTML = cartRowContents
    cartItems.appendChild(cartRow)[0]
    cartRow.getElementsByClassName('btn-delete')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

// ----------------- update cart -----------------//

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var dostavka = Number(document.getElementById('dostavka-price').textContent);
    var total = 0
    var totQty = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        totQty += Number(quantity)
        total = total + (price * quantity);
    }
    total = ((Math.round(total * 100) / 100) + dostavka).toFixed(2);
    document.getElementsByClassName('cart-total-price')[0].innerText = total + ' лв.'
    document.getElementsByClassName('index')[0].innerText = totQty
}

// ----------------- send data jquery -----------------//

$(document).ready(function () {
    $('.load').hide()
    let scriptURL = 'https://script.google.com/macros/s/AKfycbxS6VCrwD9uyOme4Ene5o_2G_QDesb65SjjkojPi5nP9ka-Wn4QJrSmMHKSv44_kQLdwA/exec'
    let form = document.forms['google-sheet']

    form.addEventListener('submit', e => {
        $('.submit').hide()
        // $('.load').show()

        e.preventDefault()
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => $("#form-alert").html("<div class='alert alert-success'> Данните Ви бяха успешно запазени!</div>"))
            .then(response => document.querySelector('.btn-purchase').style.display ="block")
            .catch(error => $("#form-alert").html("<div class='alert alert-delete'> Данните Ви не бяха запазени!</div>"))

    })
})

// ----------------- cart animation jquery -----------------//

$(document).ready(function () {
    $('.buy-button').on('click', function () {

        var button = $(this);
        var cart = $('.cart-button');
        var cartTotal = cart.attr('data-totalitems');
        var newCartTotal = parseInt(cartTotal) + 1;

        button.addClass('sendtocart');
        setTimeout(function () {
            button.removeClass('sendtocart');
            cart.addClass('shake').attr('data-totalitems', newCartTotal);
            setTimeout(function () {

                cart.removeClass('shake');
            }, 500)
        }, 100)
    })
})

// ----------------- wrapper menu jquery -----------------//

$(document).ready(function () {
    $('.filter').click(function () {
        $('.filter').removeClass('picked')
        if(!$(this).hasClass('picked')){
            $(this).addClass('picked')
        }
        let value = $(this).attr('data-filter');
        if (value == 'menu-restaurant') {
            $('.menu-restaurant').show('1000')
        }
        else {
            $('.menu-restaurant').not('.' + value).hide('1000')
            $('.menu-restaurant').filter('.' + value).show('1000')
        }
    })
})
