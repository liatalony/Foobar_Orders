window.addEventListener("DOMContentLoaded", init);

function init() {
  const addOne = document.querySelector(".more");
  const removeOne = document.querySelector(".less");
  let amount = document.querySelector(".number").value;
  const input = document.querySelector(".number");
  const addToCart = document.querySelector(".add-to-cart");

  addToCartDisabled();

  addOne.addEventListener("click", moreBeer);
  removeOne.addEventListener("click", lessBeer);
  input.addEventListener("keydown", addToCartDisabled);

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
