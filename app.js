window.addEventListener("DOMContentLoaded", init);

var beerArray = [];

// var cart = [];

// function updateCart(beerName, amount, price) {
//   if (cart.includes((x) => x.name == beerName)) {
//     cart.find((x) => x.name == beerName).amount = amount;
//   } else {
//     cart.add({ name: beerName, amount: amount, price: price });
//   }
// }

function init() {
  fetch("https://foobar-squad.herokuapp.com")
    .then((res) => res.json())
    .then((e) => {
      console.log(e.taps);
      e.taps.forEach(makeBeer);
    });
  fetch("https://foobar-squad.herokuapp.com/beertypes")
    .then((res) => res.json())
    .then(function (res) {
      beerArray = res;
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
    // beerName = "Steampunk"; //replace with actual value
    // price = 35; //replace with actual value
    document.querySelector(".number").value = amount;
    // updateCart(beerName, amount, price);
    addToCartDisabled();
  }

  function lessBeer() {
    if (amount > 0) {
      amount--;
      // beerName = "Steampunk"; //replace with actual value
      // price = 35; //replace with actual value
      // updateCart(beerName, amount, price);
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
    modalBeerImg.src = "static/" + beerType.label;

    const modalBeerCategory = document.querySelector(".modal-category");
    modalBeerCategory.textContent = beerType.category;

    const modalBeerAlc = document.querySelector(".modal-alc");
    modalBeerAlc.textContent = beerType.alc + "%";

    const modalBeerImpression = document.querySelector(".modal-description");
    modalBeerImpression.textContent = beerType.description.overAllImpression;

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

  document.querySelector(".beers").appendChild(templateCopy);
}
