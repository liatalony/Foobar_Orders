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
