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

// INVENTORY MANAGEMENT JS

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const username = loggedInUser.username;

document.getElementById("userName").textContent = username;

const inventoryKey = "inventories";
let inventories = JSON.parse(localStorage.getItem(inventoryKey)) || {};
inventories[username] = inventories[username] || [];

const form = document.getElementById("itemForm");
const table = document.getElementById("inventoryTable");

function validate(name, quantity, price, status) {
  if (!/^[A-Za-z ]+$/.test(name)) {
    alert("Name must contain only letters");
    return false;
  }
  if (quantity <= 0 || price <= 0) {
    alert("Quantity and Price must be positive numbers");
    return false;
  }
  if (!status) {
    alert("Status is required");
    return false;
  }
  return true;
}

function render() {
  table.innerHTML = "";
  inventories[username].forEach((item, index) => {
    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>${item.status}</td>
        <td class="actions">
          <button onclick="editItem(${index})">Edit</button>
          <button onclick="deleteItem(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const quantity = Number(document.getElementById("quantity").value);
  const price = Number(document.getElementById("price").value);
  const status = document.getElementById("status").value;
  const editIndex = document.getElementById("editIndex").value;

  if (!validate(name, quantity, price, status)) return;

  const item = { name, quantity, price, status };

  if (editIndex === "") {
    inventories[username].push(item);
  } else {
    inventories[username][editIndex] = item;
  }

  localStorage.setItem(inventoryKey, JSON.stringify(inventories));
  form.reset();
  document.getElementById("editIndex").value = "";
  render();
});

function editItem(index) {
  const item = inventories[username][index];
  document.getElementById("name").value = item.name;
  document.getElementById("quantity").value = item.quantity;
  document.getElementById("price").value = item.price;
  document.getElementById("status").value = item.status;
  document.getElementById("editIndex").value = index;
}

function deleteItem(index) {
  if (confirm("Delete this item?")) {
    inventories[username].splice(index, 1);
    localStorage.setItem(inventoryKey, JSON.stringify(inventories));
    render();
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

render();
