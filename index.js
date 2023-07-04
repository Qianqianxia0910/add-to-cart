import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://shopping-cart-app-320b6-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const foodInDB = ref(database, "food");

const shoppingListEl = document.getElementById("shopping-list");
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");

addButtonEl.addEventListener("click", function () {
  if (inputFieldEl.value === "") {
    alert("Please enter an valid item");
  } else {
    let inputValue = inputFieldEl.value;

    push(foodInDB, inputValue);

    clearInputField();
  }
});

onValue(foodInDB, function (snapshot) {
  if (snapshot.exists()) {
    let foodItems = Object.entries(snapshot.val());

    clearShoppingList();

    for (let i = 0; i < foodItems.length; i++) {
      let currentItem = foodItems[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      appendItemToShoppingList(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items in shopping list";
  }
});

function clearShoppingList() {
  shoppingListEl.innerHTML = "";
}
function clearInputField() {
  inputFieldEl.value = "";
}

function appendItemToShoppingList(item) {
  //   shoppingListEl.innerHTML += `<li>${itemValue}</li>`;
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    console.log(itemID);
    let exactLocationOfItem = ref(database, `food/${itemID}`);
    remove(exactLocationOfItem);
  });

  shoppingListEl.append(newEl);
}
