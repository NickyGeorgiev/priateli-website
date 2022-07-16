if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    let filterElements = document.querySelector('#menu-filters ul');
    filterElements.addEventListener('click', pickItem);

    let isOnline = false;
    let currentdate = new Date();
    let time = Number(currentdate.getHours())
    if (time < 10 || time > 22) {   //out of working time
        document.getElementById('status1').style.display = "none"
        document.getElementById('status2').style.display = "block"
    } else {
        isOnline = true;
        document.getElementById('status1').style.display = "block"
        document.getElementById('status2').style.display = "none"
    }
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const wrapper = document.getElementsByClassName('menu-wrapper')[0];
    wrapper.addEventListener('click', addToCart);

    function addToCart(e) {
        if (e.target.tagName != 'I' /*&& !isOnline*/) {
            // alert('Доставки се извършват от 16:00 ч. до 22:00 ч.');
            return;
        }
        let name = e.target.parentElement.parentElement.children[0].textContent;
        let price = e.target.parentElement.parentElement.children[2].textContent;

        document.getElementById('cart').style.display = 'block'

        let cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');

        let cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'cart-column');
        let title = document.createElement('span');
        title.classList.add('cart-item-title');
        title.textContent = name;
        cartItem.appendChild(title);

        let cartPrice = document.createElement('span');
        cartPrice.classList.add('cart-price', 'cart-column');
        let filteredPrice = price.slice(0, length - 4);
        cartPrice.textContent = Number(filteredPrice);

        let cartQuantity = document.createElement('div');
        cartQuantity.classList.add('cart-quantity', 'cart-column');
        let inputQty = document.createElement('input');
        inputQty.type = "number";
        inputQty.classList.add('cart-quantity-input');
        inputQty.value = 1;
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn-delete', 'cart-quantity-button');
        deleteBtn.textContent = 'X';

        cartQuantity.appendChild(inputQty);
        cartQuantity.appendChild(deleteBtn);

        cartRow.appendChild(cartItem);
        cartRow.appendChild(cartPrice);
        cartRow.appendChild(cartQuantity);
        cartItems.appendChild(cartRow);

        deleteBtn.addEventListener('click', () => {
            cartRow.remove();
            updateCartTotal(cartItems);
        })

        inputQty.addEventListener('change', quantityChanged.bind(null, inputQty));
        updateCartTotal(cartItems);
    }

    function quantityChanged(quantity) {
        if (isNaN(quantity.value) || quantity.value <= 0) {
            quantity.value = 1
        }
        updateCartTotal(cartItems);
    }

    function updateCartTotal(cartItems) {
        let qtyForIndex = 0;
        total = 0
        const totalElement = document.getElementsByClassName('cart-total-price')[0];
        for (const el of cartItems.children) {
            let qty = Number(el.children[2].children[0].value);
            let price = Number(el.children[1].textContent);
            qtyForIndex += qty
            total += qty * price
        }

        document.getElementsByClassName('index')[0].textContent = qtyForIndex;
        let cartBtn = document.getElementsByClassName('cart-button')[0];
        setTimeout(() => {
            cartBtn.classList.add('shake');
            setTimeout(() => {
                cartBtn.classList.remove('shake');
            }, 500)
        }, 100)

        totalElement.textContent = (total + 1.99).toFixed(2) + ' лв.';
        if (cartItems.children.length == 0) {
            document.getElementById('cart').style.display = 'none';
        }

        if ((total) > 15) {
            document.getElementsByClassName('summary')[0].style.display = 'block';
            document.getElementsByClassName('info')[0].style.display = 'none';
        } else {
            document.getElementsByClassName('summary')[0].style.display = 'none';
            document.getElementsByClassName('info')[0].style.display = 'block';
        }
    }

    function pickItem(e) {
        if(e.target.tagName == 'UL'){
            return;
        }
        let section = e.target.parentElement;
        Array.from(filterElements.children).forEach(x => x.classList.remove('picked'))
        section.classList.toggle('picked');
        let value = section.getAttribute('data-filter');
        Array.from(document.getElementsByClassName('menu-restaurant')).forEach(x => {
            if(x.classList.contains(value)){
                x.style.display = 'block'
            } else{
                x.style.display = 'none'
            }
        })
    }


}


// // ----------------- final purchase -----------------//

function purchaseClicked() {

    if (confirm("Потвърдете, че желаете да направите поръчката")) {
        let result = []
        let total =0;
        let n = document.getElementsByClassName('cart-items')[0].children
        for (let i = 0; i < n.length; i++) {
            let name = n[i].children[0].textContent.trim();
            let quantity = n[i].children[2].children[0].value;
            let price = n[i].children[1].textContent.substring(0,4);
            result.push(`${quantity} x ${name} - ${price} `)
            total += Number(quantity)*Number(price);
        }
            result.join('\n');
        result.push(`ТОТАЛ: ${(total + 1.99).toFixed(2)} лв.`)
        sendEmail(result);
    } else {
        txt = "Вие отказахте поръчката си!";
    }
    updateCartTotal()
}

// // ----------------- email send -----------------//

function sendEmail(result) {
    let input = {
        clientFirstName : document.getElementById('first'),
        clientLastName : document.getElementById('last'),
        clientTel : document.getElementById('tel'),
        adress : document.getElementById('address'),
        adressNumber : document.getElementById('adress-number'),
        blok : document.getElementById('blok'),
        vhod : document.getElementById('vhod'),
        dopalnitelno : document.getElementById('dopalnitelno')
    }

    let forSend = `${result}
    Име: ${input.clientFirstName.value} ${input.clientLastName.value}, Тел.: ${input.clientTel.value},
    Ул.: ${input.adress.value}, №: ${input.adressNumber.value}, бл.: ${input.blok.value}, вх.: ${input.vhod.value} ##### АЛЕРГЕНИ: ${input.dopalnitelno.value} #####`

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
    alert('Вашата поръчка беше направена успешно!')
    document.location.reload(true)
}


// // ----------------- send data jquery -----------------//

$(document).ready(function () {
    $('.load').hide()
    let scriptURL = 'https://script.google.com/macros/s/AKfycbxS6VCrwD9uyOme4Ene5o_2G_QDesb65SjjkojPi5nP9ka-Wn4QJrSmMHKSv44_kQLdwA/exec'
    let form = document.forms['google-sheet']

    form.addEventListener('submit', e => {
        $('.submit').hide()

        e.preventDefault()
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => $("#form-alert").html("<div class='alert alert-success'> Данните Ви бяха успешно запазени!</div>"))
            .then(response => document.querySelector('.btn-purchase').style.display ="block")
            .catch(error => $("#form-alert").html("<div class='alert alert-delete'> Данните Ви не бяха запазени!</div>"))

    })
})
