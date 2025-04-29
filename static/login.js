
const maxAccounts = 20;





function toggleForm() {
  document.getElementById("loginBox").classList.toggle("active");
  document.getElementById("signupBox").classList.toggle("active");
}




function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}






function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include at least one digit.";
  if (!/[\W_]/.test(password)) return "Password must include at least one special character.";
  return "";
}

function markValid(input, errorDiv) {
  input.classList.remove('error');
  input.classList.add('valid');
  errorDiv.textContent = '';
}





function markError(input, errorDiv, message) {
  input.classList.remove('valid');
  input.classList.add('error');
  errorDiv.textContent = message;
}

function nameValidator(name) {
  return name.trim().length >= 5 ? "" : "Name must be at least 5 characters long.";
}

function emailValidator(email) {
  return validateEmail(email) ? "" : "Invalid email address.";
}

function validateSignup() {
  const name = document.getElementById('signupName');
  const email = document.getElementById('signupEmail');
  const password = document.getElementById('signupPassword');

  const nameError = document.getElementById('signupNameError');
  const emailError = document.getElementById('signupEmailError');
  const passwordError = document.getElementById('signupPasswordError');

  const nameErr = nameValidator(name.value);
  const emailErr = emailValidator(email.value);
  const passErr = validatePassword(password.value);

  let isValid = true;

  if (nameErr) { markError(name, nameError, nameErr); isValid = false; } else { markValid(name, nameError); }
  if (emailErr) { markError(email, emailError, emailErr); isValid = false; } else { markValid(email, emailError); }
  if (passErr) { markError(password, passwordError, passErr); isValid = false; } else { markValid(password, passwordError); }

  if (!isValid) return;

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.length >= maxAccounts) {
    alert("Max 20 accounts allowed.");
    return;
  }

  const exists = users.find(u => u.email === email.value);
  if (exists) {
    alert("Account already exists!");
    return;
  }

  users.push({ name: name.value, email: email.value, password: password.value });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful!");
  toggleForm();
}

function validateLogin() {
  const email = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword');
  const emailError = document.getElementById('loginEmailError');
  const passwordError = document.getElementById('loginPasswordError');

  const emailErr = emailValidator(email.value);
  const passErr = validatePassword(password.value);

  let isValid = true;

  if (emailErr) { markError(email, emailError, emailErr); isValid = false; } else { markValid(email, emailError); }
  if (passErr) { markError(password, passwordError, passErr); isValid = false; } else { markValid(password, passwordError); }

  if (!isValid) return;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const matched = users.find(u => u.email === email.value && u.password === password.value);

  if (matched) {
    alert("Login successful! Welcome " + matched.name);
  } else {
    alert("Invalid email or password.");
  }
}


function togglePasswordVisibility(inputId, iconId) {
  const passwordField = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);
  const isPassword = passwordField.type === "password";

  passwordField.type = isPassword ? "text" : "password";
  eyeIcon.classList.toggle('fa-eye');
  eyeIcon.classList.toggle('fa-eye-slash');
}



function handleGoogleResponse(response) {
  const data = jwt_decode(response.credential);

  fetch('/google-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: response.credential })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      window.location.href = "/";
    } else {
      alert("Google login failed!");
    }
  })
  .catch(() => alert("Server error during Google login."));
}

window.addEventListener("DOMContentLoaded", () => {
  ["signupName", "signupEmail", "signupPassword"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      const input = document.getElementById(id);
      const errorDiv = document.getElementById(id + "Error");
      const validator = id.includes("Name") ? nameValidator :
                        id.includes("Email") ? emailValidator : validatePassword;
      const err = validator(input.value);
      err ? markError(input, errorDiv, err) : markValid(input, errorDiv);
    });
  });

  ["loginEmail", "loginPassword"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      const input = document.getElementById(id);
      const errorDiv = document.getElementById(id + "Error");
      const validator = id.includes("Email") ? emailValidator : validatePassword;
      const err = validator(input.value);
      err ? markError(input, errorDiv, err) : markValid(input, errorDiv);
    });
  });
});



function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: "Bearer " + response.credential
    }
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("User Info: ", data);
    // You can store user info or use it within your app.
  });
}