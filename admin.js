// ADMIN LOGIC

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const username = loggedInUser.username;

// DOM references
const addUserForm = document.getElementById("addUserForm");
const usersTable = document.getElementById("usersTable");
const searchUserInput = document.getElementById("searchUserInput");
const editUserIndex = document.getElementById("editUserIndex");

const searchInventoryInput = document.getElementById("searchInventoryInput");
const filterUserSelect = document.getElementById("filterUserSelect");
const filterStatusSelect = document.getElementById("filterStatusSelect");
const allInventoryTable = document.getElementById("allInventoryTable");

// Storage keys
const usersKey = "users";
const inventoriesKey = "inventories";

let users = JSON.parse(localStorage.getItem(usersKey)) || [];
let inventories = JSON.parse(localStorage.getItem(inventoriesKey)) || {};

// --- USERS MANAGEMENT ---

function renderUsers() {
  const searchText = searchUserInput.value.toLowerCase();
  usersTable.innerHTML = "";

  users.forEach((user, index) => {
    if (!user.username.toLowerCase().includes(searchText)) return;

    usersTable.innerHTML += `
      <tr>
        <td>${user.username}</td>
        <td>${user.names}</td>
        <td>${user.phoneNumber}</td>
        <td>
          <button onclick="editUser(${index})">Edit</button>
          <button onclick="deleteUser(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  populateUserFilter(); // update filterUserSelect
}

function editUser(index) {
  const user = users[index];
  document.getElementById("newUsername").value = user.username;
  document.getElementById("newNames").value = user.names;
  document.getElementById("newPhoneNumber").value = user.phoneNumber;
  document.getElementById("newPassword").value = user.password;
  editUserIndex.value = index;
}

function deleteUser(index) {
  if (!confirm("Delete this user and all their inventory items?")) return;

  const usernameToDelete = users[index].username;

  // Remove user's inventory
  if (inventories[usernameToDelete]) {
    delete inventories[usernameToDelete];
    localStorage.setItem(inventoriesKey, JSON.stringify(inventories));
  }

  // Remove user
  users.splice(index, 1);
  localStorage.setItem(usersKey, JSON.stringify(users));
  renderUsers();
  renderAllInventory();
}

addUserForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newUsernameValue = document.getElementById("newUsername").value.trim();
  const newNamesValue = document.getElementById("newFullName").value.trim();
  const newPhoneNumberValue = document
    .getElementById("newPhoneNumber")
    .value.trim();
  const newPasswordValue = document.getElementById("newPassword").value.trim();

  if (
    !newUsernameValue ||
    !newNamesValue ||
    !newPhoneNumberValue ||
    !newPasswordValue
  )
    return;

  const userObj = {
    username: newUsernameValue,
    names: newNamesValue,
    phoneNumber: newPhoneNumberValue,
    password: newPasswordValue,
  };

  if (editUserIndex.value === "") {
    // add
    users.push(userObj);
  } else {
    // update
    users[editUserIndex.value] = userObj;
  }

  localStorage.setItem(usersKey, JSON.stringify(users));
  addUserForm.reset();
  editUserIndex.value = "";
  renderUsers();
});

// live search users
searchUserInput.addEventListener("input", renderUsers);

// --- INVENTORY MANAGEMENT ---

function renderAllInventory() {
  const searchText = searchInventoryInput.value.toLowerCase();
  const selectedUser = filterUserSelect.value;
  const selectedStatus = filterStatusSelect.value;

  allInventoryTable.innerHTML = "";

  Object.keys(inventories).forEach((user) => {
    if (selectedUser && selectedUser !== user) return;

    inventories[user].forEach((item) => {
      if (!item.name.toLowerCase().includes(searchText)) return;
      if (selectedStatus && item.status !== selectedStatus) return;

      allInventoryTable.innerHTML += `
        <tr>
          <td>${user}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price}</td>
          <td>${item.status}</td>
        </tr>
      `;
    });
  });
}

function populateUserFilter() {
  filterUserSelect.innerHTML = `<option value="">All Users</option>`;
  users.forEach((user) => {
    filterUserSelect.innerHTML += `<option value="${user.username}">${user.username}</option>`;
  });
}

// live filters
searchInventoryInput.addEventListener("input", renderAllInventory);
filterUserSelect.addEventListener("change", renderAllInventory);
filterStatusSelect.addEventListener("change", renderAllInventory);

// --- LOGOUT ---
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// Initial render
renderUsers();
renderAllInventory();
