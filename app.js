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

///////Andy////////
var stripe = Stripe("pk_test_LuzUexPeMfDZJScP1gp1mcLa00TQx0THAK");
var elements = stripe.elements();

var card = elements.create("card", {
  hidePostalCode: true,
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#8898AA",
      color: "white",
      lineHeight: "36px",
      fontWeight: 300,
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: "19px",

      "::placeholder": {
        color: "#8898AA",
      },
    },
    invalid: {
      iconColor: "#e85746",
      color: "#e85746",
    },
  },
  classes: {
    focus: "is-focused",
    empty: "is-empty",
  },
});
card.mount("#card-element");

var inputs = document.querySelectorAll("input.field");
Array.prototype.forEach.call(inputs, function (input) {
  input.addEventListener("focus", function () {
    input.classList.add("is-focused");
  });
  input.addEventListener("blur", function () {
    input.classList.remove("is-focused");
  });
  input.addEventListener("keyup", function () {
    if (input.value.length === 0) {
      input.classList.add("is-empty");
    } else {
      input.classList.remove("is-empty");
    }
  });
});

function setOutcome(result) {
  var successElement = document.querySelector(".success");
  var errorElement = document.querySelector(".error");
  successElement.classList.remove("visible");
  errorElement.classList.remove("visible");

  if (result.token) {
    // Use the token to create a charge or a customer
    // https://stripe.com/docs/payments/charges-api
    successElement.querySelector(".token").textContent = result.token.id;
    successElement.classList.add("visible");
  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add("visible");
  }
}

card.on("change", function (event) {
  setOutcome(event);
});

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  var form = document.querySelector("form");
  var extraDetails = {
    name: form.querySelector("input[name=cardholder-name]").value,
  };
  stripe.createToken(card, extraDetails).then(setOutcome);
});
