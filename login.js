// LOGIN LOGIC

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const validUser = users.find(
    (user) => user.username === username && password
  );

  if (validUser) {
    localStorage.setItem("loggedInUser", JSON.stringify(validUser));
    alert("User logged in successfully");

    if (validUser.username === "ADMIN") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "inventoryPage.html";
    }
  } else {
    alert("Invalid credentials");
  }
});
