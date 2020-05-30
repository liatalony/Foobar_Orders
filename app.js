window.addEventListener("DOMContentLoaded", init);
const theme = document.querySelector("#checkbox");

var beerArray = [];

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
  fetch("https://foobar-squad.herokuapp.com/beertypes")
    .then((res) => res.json())
    .then(function (res) {
      beerArray = res;
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

let counter = 0;
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
  tapId: 0,
  price: 35,
};

function makeBeer(beer) {
  // Beer is TAP!!
  // append all the beers on tap in the html with the right data
  const templateCopy = document.querySelector(".order-page-template").content.cloneNode(true); // copying the template
  templateCopy.querySelector(".beer-name").textContent = beer.beer; //beer name
  templateCopy.querySelector(".storage span").textContent = beer.level / 50 + " "; // number of beer cups left
  const beerLogo = templateCopy.querySelector(".beer-logo"); // beer img
  beerLogo.src = `static/beer-logos/${beer.beer.replace(/\s/g, "").toLowerCase()}.png`; //beer img src

  const inputField = templateCopy.querySelector("input"); // number of beer
  inputField.id = `tap-${beer.id}-amount-input`; //generate id for tap input field
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
        beerorder.price = 35;
        beerorder.tapId = beer.id;
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

  //Creating modal for each beer description //
  const article = templateCopy.querySelector("article");
  article.addEventListener("click", function () {
    var element = document.querySelector(".modalcontainer");
    const modal = document.querySelector(".modalbg");
    modal.style.display = "block";

    const modalBeerName = document.querySelector(".modal-beername");
    var beerType = beerArray.find((x) => x.name == beer.beer);
    modalBeerName.textContent = beerType.name;

    const modalBeerImg = document.querySelector(".modal-img");
    modalBeerImg.src = "static/beer-logos/" + beerType.label;

    const modalBeerCategory = document.querySelector(".modal-category");
    modalBeerCategory.textContent = beerType.category;

    const modalBeerAlc = document.querySelector(".modal-alc");
    modalBeerAlc.textContent = "Alcohol: " + beerType.alc + "%";

    const modalBeerImpression = document.querySelector(".modal-description");
    modalBeerImpression.textContent = beerType.description.overallImpression;

    const body = document.querySelector("body");
    body.classList.add("modalopen");
    const exit = document.querySelector(".exit");
    exit.addEventListener("click", function () {
      modal.style.display = "none";
      body.classList.remove("modalopen");
      element.classList.remove(...element.classList);
      element.classList.add("modalcontainer");
    });
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

  const totalAmountText = document.querySelector("#total-number-of-beers"); //display total amount of beers
  totalAmountText.innerHTML = `${totalAmount} Items`;

  var totalPrice = beerCart.map((a) => a.price * a.amount).reduce((a, b) => a + b, 0); //Calculate the total price of the cart
  const finalPriceText = document.querySelector("#final-price"); //display total amount of beers
  finalPriceText.textContent = `${totalPrice} DKK`;

  console.log(beerCart);
  document.querySelector(".items").innerHTML = "";
  beerCart.forEach((x) => displayCart(x));
}
//Make the Your Order Page dynamic - Viki

function displayCart(beer) {
  const templateOrderCopy = document.querySelector(".your-order-template").content.cloneNode(true); // copying the template
  templateOrderCopy.querySelector(".your-beer").textContent = beer.beerName; //beer name

  const inputField = templateOrderCopy.querySelector(".amount-of-beer"); // number of beer
  inputField.value = beer.amount;

  const amountOfBeer = templateOrderCopy.querySelector(".current-amount");
  console.log(amountOfBeer);
  amountOfBeer.textContent = `${beer.amount} X ${35},-`;
  const plus = templateOrderCopy.querySelector(".more"); // plus button
  const minus = templateOrderCopy.querySelector(".less"); // minus button[]

  plus.addEventListener("click", function (event) {
    // add beer to cart by clicking plus
    numOfOrders.classList.remove("hidden"); // show number of beers in cart
    if (inputField.value < 99) {
      // theres a maximum of 99 beers of each type that can be ordered
      //event.preventDefault();
      const currentValue = Number(inputField.value); // the current number thats in the input
      inputField.value = currentValue + 1; // add 1 to that number
      const beerCheck = beerCart.filter((Object) => Object.beerName == beer.beerName); // check if this beer already exists in the cart
      if (beerCheck.length == 0) {
        // if beer does not exist in the cart
        const beerorder = Object.create(beerInfo); // create a new beerInfo object
        beerorder.beerName = beer.beerName; //append beer name
        beerorder.amount++; // append beer amount
        beerorder.tapId = beer.tapId; // id of tap
        beerCart.push(beerorder); // add the beer to the cart
      } else {
        // if  beer does exist in cart
        beerCart.map((Object) => {
          //get the object of that beer from the cart
          if (Object.beerName == beer.beerName) {
            Object.amount++; // update the amount of that beer
            document.querySelector(`#tap-${beer.tapId}-amount-input`).value = Object.amount;
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
        if (Object.beerName == beer.beerName) {
          if (Object.amount == 1) {
            // if the number of beers on the order is 1 -  remove the object from the cart
            beerCart.splice(Object, 1);
            document.querySelector(`#tap-${beer.tapId}-amount-input`).value = Object.amount;
          } else {
            // if theres more than 1 beer
            Object.amount--; // remove 1
            document.querySelector(`#tap-${beer.tapId}-amount-input`).value = Object.amount;
          }
        }
      });

      updateCart(); // update the number shown on the cart
    }
  });
  document.querySelector(".items").appendChild(templateOrderCopy);
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
  // const templateCopy = document.querySelector(".order-page-template").content.cloneNode(true);
  // templateCopy.querySelector(".beer-name").textContent = beer.beer;
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
