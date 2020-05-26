window.addEventListener("DOMContentLoaded", init);

function init() {
  fetch("https://foobar-squad.herokuapp.com")
    .then((res) => res.json())
    .then((e) => {
      console.log(e.taps);
      e.taps.forEach(makeBeer);
    });

  //  addToCartDisabled();

  //input.addEventListener("keydown", addToCartDisabled);
  cart.addEventListener("click", slideRight);
  goToPayment.addEventListener("click", slideRight);
  prev.forEach(function (button) {
    button.addEventListener("click", slideLeft);
  });
}

const cart = document.querySelector(".cart");
let numOfOrders = document.querySelector(".number-of-orders");
const goToPayment = document.querySelector(".proceed");
const prev = document.querySelectorAll(".previous");

function moreBeer(amount) {
  amount++;
  return amount;
  //document.querySelector(".number").value = amount;
  // addToCartDisabled();
}

function lessBeer(amount) {
  if (amount > 0) {
    amount--;
    document.querySelector(".number").value = amount;
    //addToCartDisabled();
  }

  function addToCartDisabled() {
    if (amount > 0) {
      addToCart.disabled = false;
    } else {
      addToCart.disabled = true;
    }
  }
}

//Bootstrap count button
/*
$(document).ready(function () {
  $(".count").prop("disabled", true);
  $(document).on("click", ".plus", function () {
    $(".count").val(parseInt($(".count").val()) + 1);
  });
  $(document).on("click", ".minus", function () {
    $(".count").val(parseInt($(".count").val()) - 1);
    if ($(".count").val() == 0) {
      $(".count").val(1);
    }
  });
});*/
let counter = 0;
function slideRight() {
  console.log("right");

  counter++;
  document.querySelector("main").style.transform = "translateX(" + -100 * counter + "vw)";
  document.querySelector(".go-to-cart").style.opacity = "0";
  document.querySelector(".go-to-cart").disabled = true;
}

function slideLeft() {
  console.log("left");

  counter--;
  document.querySelector("main").style.transform = "translateX(" + -100 * counter + "vw)";
  if (counter == 0) {
    document.querySelector(".go-to-cart").style.opacity = "1";
    document.querySelector(".go-to-cart").disabled = false;
  }
}

const beerCart = [];
const beerInfo = {
  beerName: "",
  amount: 0,
};
function makeBeer(beer) {
  const templateCopy = document.querySelector(".order-page-template").content.cloneNode(true);
  templateCopy.querySelector(".beer-name").textContent = beer.beer;
  templateCopy.querySelector(".storage span").textContent = beer.level / 50 + " ";
  const beerLogo = templateCopy.querySelector(".beer-logo");
  beerLogo.setAttribute("src", `static/beer-logos/${beer.beer.replace(/\s/g, "").toLowerCase()}.png`);

  console.log(beerLogo.src);

  const inputField = templateCopy.querySelector("input");
  const plus = templateCopy.querySelector(".more");
  const minus = templateCopy.querySelector(".less");

  plus.addEventListener("click", function (event) {
    numOfOrders.classList.remove("hidden");
    if (inputField.value < 99) {
      event.preventDefault();
      const currentValue = Number(inputField.value);
      inputField.value = currentValue + 1;
      const beerCheck = beerCart.filter((Object) => Object.beerName == beer.beer);
      if (beerCheck.length == 0) {
        const beerorder = Object.create(beerInfo);
        beerorder.beerName = beer.beer;
        beerorder.amount++;

        beerCart.push(beerorder);
      } else {
        beerCart.map((Object) => {
          if (Object.beerName == beer.beer) {
            Object.amount++;
          }
        });
      }
      updateCart();
    }
  });
  minus.addEventListener("click", function (event) {
    if (inputField.value > 0) {
      event.preventDefault();
      const currentValue = Number(inputField.value);
      inputField.value = currentValue - 1;
      beerCart.map((Object) => {
        if (Object.beerName == beer.beer) {
          if (Object.amount == 1) {
            beerCart.splice(Object, 1);
          } else {
            Object.amount--;
          }
        }
      });

      updateCart();
    }
  });
  document.querySelector(".beers").appendChild(templateCopy);
}

function updateCart() {
  //count thr number of orders in the cart
  //numOfOrders.textContent = beerCart.length;

  // Count the TOTAL amount of beers in the cart
  let totalAmount = 0;
  if (beerCart.length == 0) {
    numOfOrders.classList.add("hidden");
  }
  for (let index = 0; index < beerCart.length; index++) {
    totalAmount = totalAmount + beerCart[index].amount;
  }
  numOfOrders.textContent = totalAmount;

  console.log(beerCart);
}
