window.addEventListener("DOMContentLoaded", init);
const theme = document.querySelector("#checkbox");

function init() {
  let themeCheck = localStorage.getItem("theme-color"); // checking what the selected theme is in the local storage
  if (themeCheck == "light") {
    //if light theme is selected
    enableLightMode();
  }
  theme.addEventListener("change", changeTheme);

  fetch("https://foobar-squad.herokuapp.com") //fetching all the bar info
    .then((res) => res.json())
    .then((e) => {
      console.log(e.taps);
      e.taps.forEach(makeBeer); //only sending th tap list
    });

  //addToCartDisabled();

  //input.addEventListener("keydown", addToCartDisabled);

  // eventListeners for the sliders
  cart.addEventListener("click", slideRight);
  goToPayment.addEventListener("click", slideRight);
  prev.forEach(function (button) {
    button.addEventListener("click", slideLeft);
  });
}

function enableLightMode() {
  document.querySelector("body").classList.add("light-mode"); //class that changes the :root cusom variables
  document.querySelector("#checkbox").checked = true; // theme checkbox is checked
  localStorage.setItem("theme-color", "light"); // updates to local storage
}
function disableLightMode() {
  document.querySelector("body").classList.remove("light-mode"); //removes light mode class
  document.querySelector("#checkbox").checked = false; // theme checkbox is not checked
  localStorage.setItem("theme-color", null); // updated to local storage
}
function changeTheme() {
  // clicking eventListener to cahnge the color theme
  lightMode = localStorage.getItem("theme-color"); // get the data in local storage
  if (theme.checked == true) {
    // if checkbox is checked
    enableLightMode(); // change to light Mode
  } else {
    // if checkbox is not checked
    disableLightMode(); // change to dark/default mode
  }
}

const cart = document.querySelector(".cart"); //cart button
let numOfOrders = document.querySelector(".number-of-orders"); // number of orders in the cart
const goToPayment = document.querySelector(".proceed"); // procceed button in "your order" page
const prev = document.querySelectorAll(".previous"); // back arrows to slide back

function addToCartDisabled() {
  if (amount > 0) {
    addToCart.disabled = false;
  } else {
    addToCart.disabled = true;
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
let counter = 0; // decides the position of the page
function slideRight() {
  counter++;
  document.querySelector("main").style.transform = "translateX(" + -100 * counter + "vw)"; //move to this point
  cart.removeEventListener("click", slideRight);
  document.querySelector(".go-to-cart").style.opacity = "0";
}

function slideLeft() {
  counter--;
  document.querySelector("main").style.transform = "translateX(" + -100 * counter + "vw)"; //move to this point
  if (counter == 0) {
    document.querySelector(".go-to-cart").style.opacity = "1";
    cart.addEventListener("click", slideRight);
    document.querySelector(".go-to-cart").disabled = false;
  }
}

const beerCart = []; // Array to save all the ordered beers
const beerInfo = {
  //the object for each type of ordered beer
  beerName: "",
  amount: 0,
  price: 35,
};

function makeBeer(beer) {
  // append all the beers on tap in the html with the right data
  const templateCopy = document.querySelector(".order-page-template").content.cloneNode(true); // copying the template
  templateCopy.querySelector(".beer-name").textContent = beer.beer; //beer name
  templateCopy.querySelector(".storage span").textContent = beer.level / 50 + " "; // number of beer cups left
  const beerLogo = templateCopy.querySelector(".beer-logo"); // beer img
  beerLogo.src = `beer-logos/${beer.beer.replace(/\s/g, "").toLowerCase()}.png`; //beer img src

  const inputField = templateCopy.querySelector("input"); // number of beer
  const plus = templateCopy.querySelector(".more"); // plus button
  const minus = templateCopy.querySelector(".less"); // minus button

  plus.addEventListener("click", function (event) {
    // add beer to cart by clicking plus
    numOfOrders.classList.remove("hidden"); // show number of beers in cart
    if (inputField.value < 99) {
      // theres a maximum of 99 beers of each type that can be ordered
      //event.preventDefault();
      const currentValue = Number(inputField.value); // the current number thats in the input
      inputField.value = currentValue + 1; // add 1 to that number
      const beerCheck = beerCart.filter((Object) => Object.beerName == beer.beer); // check if this beer already exists in the cart
      if (beerCheck.length == 0) {
        // if beer does not exist in the cart
        const beerorder = Object.create(beerInfo); // create a new beerInfo object
        beerorder.beerName = beer.beer; //append beer name
        beerorder.amount++; // append beer amount

        beerCart.push(beerorder); // add the beer to the cart
      } else {
        // if  beer does exist in cart
        beerCart.map((Object) => {
          //get the object of that beer from the cart
          if (Object.beerName == beer.beer) {
            Object.amount++; // update the amount of that beer
          }
        });
      }
      updateCart(); // update the number shown on the cart
    }
  });
  minus.addEventListener("click", function (event) {
    // remove beer from the cart by clicking minus
    if (inputField.value > 0) {
      // prevents the number of beers to be under 0
      event.preventDefault();
      const currentValue = Number(inputField.value); // current beer number
      inputField.value = currentValue - 1; // remove one beer from that current number
      beerCart.map((Object) => {
        //get the beer order from the cart
        if (Object.beerName == beer.beer) {
          if (Object.amount == 1) {
            // if the number of beers on the order is 1 -  remove the object from the cart
            beerCart.splice(Object, 1);
          } else {
            // if theres more than 1 beer
            Object.amount--; // remove 1
          }
        }
      });

      updateCart(); // update the number shown on the cart
    }
  });
  document.querySelector(".beers").appendChild(templateCopy); // append the beer information in the HTML
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
    // loop the adds the amount of each beer to a total number of all the beers in the cart
    totalAmount = totalAmount + beerCart[index].amount;
  }
  numOfOrders.textContent = totalAmount;

  console.log(beerCart);
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
