const form = document.getElementById("form");
const username = document.getElementById("fullname");
const email = document.getElementById("cardnumber");
const password2 = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkInputs();
});

function checkInputs() {
  // trim to remove the whitespaces
  const fullnameValue = fullname.value.trim();
  const cardnumberValue = cardnumber.value.trim();
  const passwordValue = password.value.trim();

  if (fullnameValue === "") {
    setErrorFor(fullname, "Please insert your full name!");
  } else {
    setSuccessFor(fullname);
  }

  if (cardnumberValue === "") {
    setErrorFor(cardnumber, "Please insert card!");
  } else if (cardnumberValue) {
    setErrorFor(cardnumber, "Not a valid card!");
  } else {
    setSuccessFor(cardnumber);
  }

  if (passwordValue === "") {
    setErrorFor(password, "Please insert CVV!");
  } else if (passwordValue) {
    setErrorFor(password, "Not a valid CVV!");
  } else {
    setSuccessFor(password);
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  formControl.className = "form-control error";
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}
