const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const names = document.getElementById("names").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    alert("Username already exists!");
    return;
  }

  const newUser = {
    username,
    names,
    phone,
    password,
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful!");

  signupForm.reset();
  window.location.href = "loginPage.html";
});
