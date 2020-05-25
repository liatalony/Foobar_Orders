window.addEventListener("DOMContentLoaded", init);

function init() {
  fetch("https://foobar-squad.herokuapp.com")
    .then((res) => res.json())
    .then((e) => {
      console.log(e.taps);
      e.taps.forEach(makeBeer);
    });

  const addOne = document.querySelector(".more");
  const removeOne = document.querySelector(".less");
  let amount = document.querySelector(".number").value;
  const input = document.querySelector(".number");
  const addToCart = document.querySelector(".add-to-cart");
  const cart = document.querySelector(".cart");
  const goToPayment = document.querySelector(".proceed");
  const prev = document.querySelectorAll(".previous");

  addToCartDisabled();

  addOne.addEventListener("click", moreBeer);
  removeOne.addEventListener("click", lessBeer);
  input.addEventListener("keydown", addToCartDisabled);
  cart.addEventListener("click", slideRight);
  goToPayment.addEventListener("click", slideRight);
  prev.forEach(function (button) {
    button.addEventListener("click", slideLeft);
  });

  function moreBeer() {
    amount++;
    document.querySelector(".number").value = amount;
    addToCartDisabled();
  }

  function lessBeer() {
    if (amount > 0) {
      amount--;
      document.querySelector(".number").value = amount;
      addToCartDisabled();
    }
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
});
let counter = 0;
function slideRight() {
  console.log("right");

  counter++;
  document.querySelector("main").style.transform = "translateX(" + -100 * counter + "vw)";
  if (counter > 0) {
    document.querySelector(".go-to-cart").style.opacity = "0";
    document.querySelector(".go-to-cart").disabled = true;
  } else {
    document.querySelector(".go-to-cart").style.opacity = "1";
    document.querySelector(".go-to-cart").disabled = false;
  }
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

function makeBeer(beer) {
  const templateCopy = document.querySelector(".order-page-template").content.cloneNode(true);
  templateCopy.querySelector(".beer-name").textContent = beer.beer;
  document.querySelector(".beers").appendChild(templateCopy);
}
