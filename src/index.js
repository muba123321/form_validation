const errorDisplay = document.getElementById("errorDisplay");
const registrationForm = document.getElementById("registration");
const loginForm = document.getElementById("login");

function displayAlert(message) {
  errorDisplay.innerHTML = message;
  errorDisplay.style.display = "block";
}

function clearError() {
  errorDisplay.style.display = "none";
}

// use helper function to handle form submit for registration form and logon form
registrationForm.addEventListener("submit", validateRegistration);
loginForm.addEventListener("submit", validateLogin);

/** HELPER FUNCTIONS */
function validateRegistration(event) {
  // prevent default submit logic
  event.preventDefault();

  // Clear any previous errors
  clearError();

  // Validate username
  if (!userNameValidation(registrationForm.elements.username)) {
    return;
  }

  // Validate email
  if (!emailValidation(registrationForm.elements.email)) {
    return;
  }

  // Validate password
  if (
    !passwordValidation(
      registrationForm.elements.password,
      registrationForm.elements.passwordCheck,
      registrationForm.elements.username.value
    )
  ) {
    return;
  }

  // Validate terms and conditions
  if (!termsValidation(registrationForm.elements.terms)) {
    return;
  }

  // If everything is valid, store the data
  storeUserData(
    registrationForm.elements.username.value,
    registrationForm.elements.email.value,
    registrationForm.elements.password.value
  );

  // Clear form fields
  registrationForm.reset();
  displayAlert("Registration successful!");
}

function userNameValidation(userName) {
  if (userName.value === "") {
    displayAlert("Please enter a username.");
    userName.focus();
    return false;
  }
  if (userName.value.length < 4) {
    displayAlert("The username must be at least four characters long.");
    userName.focus();
    return false;
  }

  if (!/([a-zA-Z0-9])(?!\1{3,})/g.test(userName.value)) {
    displayAlert("The username must contain at least two unique characters.");
    userName.focus();
    return false;
  }

  if (!userName.value.match(/^[A-Za-z0-9]+$/)) {
    displayAlert(
      "The username cannot contain any special characters or whitespace."
    );
    userName.focus();
    return false;
  }

  // Check if username is unique
  const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
  if (storedUsers[userName.value.toLowerCase()]) {
    displayAlert("That username is already taken.");
    userName.focus();
    return false;
  }

  return true;
}

function emailValidation(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    displayAlert("Please enter a valid email address.");
    email.focus();
    return false;
  }

  if (email.value.toLowerCase().endsWith("@example.com")) {
    displayAlert("Emails from 'example.com' are not allowed.");
    email.focus();
    return false;
  }

  return true;
}

function passwordValidation(password, passwordCheck, userName) {
  if (password.value.length < 12) {
    displayAlert("Password must be at least 12 characters long.");
    password.focus();
    return false;
  }

  if (!/[A-Z]/.test(password.value) || !/[a-z]/.test(password.value)) {
    displayAlert("Password must contain both uppercase and lowercase letters.");
    password.focus();
    return false;
  }

  if (!/[0-9]/.test(password.value)) {
    displayAlert("Password must contain at least one number.");
    password.focus();
    return false;
  }

  if (!/[^a-zA-Z0-9]/.test(password.value)) {
    displayAlert("Password must contain at least one special character.");
    password.focus();
    return false;
  }

  if (password.value.toLowerCase().includes("password")) {
    displayAlert("Password cannot contain the word 'password'.");
    password.focus();
    return false;
  }

  if (password.value.toLowerCase().includes(userName.toLowerCase())) {
    displayAlert("Password cannot contain the username.");
    password.focus();
    return false;
  }

  if (password.value !== passwordCheck.value) {
    displayAlert("Both passwords must match.");
    passwordCheck.focus();
    return false;
  }

  return true;
}

function termsValidation(terms) {
  if (!terms.checked) {
    displayAlert("You must agree to the terms and conditions.");
    terms.focus();
    return false;
  }

  return true;
}

function storeUserData(username, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  users[username.toLowerCase()] = {
    email: email.toLowerCase(),
    password: password,
  };
  localStorage.setItem("users", JSON.stringify(users));
}

function validateLogin(event) {
  
  event.preventDefault();

  // Clear any previous errors
  clearError();

  const username = loginForm.elements.username.value.toLowerCase();
  const password = loginForm.elements.password.value;

  if (username === "") {
    displayAlert("Please enter your username.");
    loginForm.elements.username.focus();
    return;
  }

  const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
 
  if (!storedUsers[username]) {
    displayAlert("That username does not exist.");
    loginForm.elements.username.focus();
    return;
  }

  if (password === "") {
    displayAlert("Please enter your password.");
    loginForm.elements.password.focus();
    return;
  }

  if (storedUsers[username].password !== password) {
    displayAlert("Incorrect password.");
    loginForm.elements.password.focus();
    return;
  }

  // Clear form fields
  loginForm.reset();
  displayAlert("Login successful!");

  if (loginForm.elements.persist.checked) {
    displayAlert("Login successful! (Keep me logged in)");
  }
}
