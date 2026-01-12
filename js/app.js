// ===============================
// STATE
// ===============================
let items = [];

// ===============================
// DOM ELEMENTS
// ===============================
const amountInput = document.getElementById("amountReceived");
const itemNameInput = document.getElementById("itemName");
const itemPriceInput = document.getElementById("itemPrice");
const itemsList = document.getElementById("itemsList");
const emptyState = document.getElementById("emptyState");
const balanceDisplay = document.getElementById("balanceDisplay");
const spentDisplay = document.getElementById("spentDisplay");
const totalDisplay = document.getElementById("totalDisplay");
const progressBar = document.getElementById("progressBar");
const itemCount = document.getElementById("itemCount");
const messageBox = document.getElementById("messageBox");
const whatsappInput = document.getElementById("whatsappNumber");

// ===============================
// HELPER FUNCTIONS
// ===============================
function calculateTotal() {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function updateDashboard() {
  const amountReceived = Number(amountInput.value) || 0;
  const totalSpent = calculateTotal();
  const balance = amountReceived - totalSpent;
  const percentage =
    amountReceived > 0 ? (totalSpent / amountReceived) * 100 : 0;

  balanceDisplay.textContent = `KES ${balance.toLocaleString()}`;
  spentDisplay.textContent = `KES ${totalSpent.toLocaleString()}`;
  totalDisplay.textContent = `KES ${amountReceived.toLocaleString()}`;
  progressBar.style.width = `${Math.min(percentage, 100)}%`;

  // Change progress bar color based on spending
  if (percentage > 90) {
    progressBar.classList.remove("bg-green-400", "bg-yellow-400");
    progressBar.classList.add("bg-red-400");
  } else if (percentage > 70) {
    progressBar.classList.remove("bg-green-400", "bg-red-400");
    progressBar.classList.add("bg-yellow-400");
  } else {
    progressBar.classList.remove("bg-red-400", "bg-yellow-400");
    progressBar.classList.add("bg-green-400");
  }
}

function renderItems() {
  // Update item count
  itemCount.textContent = items.length;

  // Show/hide empty state
  if (items.length === 0) {
    emptyState.classList.remove("hidden");
    itemsList.innerHTML = "";
    itemsList.appendChild(emptyState);
    return;
  }

  emptyState.classList.add("hidden");

  itemsList.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className =
      "bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-gray-100 animate-scale-in";
    li.innerHTML = `
      <div class="flex items-center gap-3 flex-1">
        <div class="bg-md-primaryContainer text-md-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold">
          ${index + 1}
        </div>
        <div class="flex-1">
          <p class="font-medium text-gray-800">${item.name}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-md-primary font-bold">KES ${item.price.toLocaleString()}</span>
        <button onclick="deleteItem(${index})" class="text-gray-400 hover:text-red-500 transition-colors p-1">
          <span class="material-icons-round text-sm">delete</span>
        </button>
      </div>
    `;
    itemsList.appendChild(li);
  });

  updateDashboard();
}

// ===============================
// CORE FUNCTIONS
// ===============================
function addItem() {
  const name = itemNameInput.value.trim();
  const price = Number(itemPriceInput.value);

  if (!name) {
    alert("Please enter an item name");
    return;
  }

  if (!price || price <= 0) {
    alert("Please enter a valid price");
    return;
  }

  items.push({ name, price });

  // Clear inputs
  itemNameInput.value = "";
  itemPriceInput.value = "";
  itemNameInput.focus();

  renderItems();
}

function deleteItem(index) {
  items.splice(index, 1);
  renderItems();
}

function generateMessage() {
  const amountReceived = Number(amountInput.value);

  if (!amountReceived || amountReceived <= 0) {
    alert("Please enter the amount received");
    return;
  }

  if (items.length === 0) {
    alert("Please add at least one item");
    return;
  }

  const totalSpent = calculateTotal();
  const balance = amountReceived - totalSpent;
  const now = new Date();

  // Build message
  let message = `📄 EXPENSE REPORT\n`;
  message += `Date: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n\n`;
  message += `Items:\n`;

  items.forEach((item, i) => {
    message += `${i + 1}. ${item.name} - KES ${item.price.toLocaleString()}\n`;
  });

  message += `\n${"─".repeat(30)}\n`;
  message += `💰 Amount Received: KES ${amountReceived.toLocaleString()}\n`;
  message += `💸 Total Spent: KES ${totalSpent.toLocaleString()}\n`;
  message += `📊 Balance: KES ${balance.toLocaleString()}\n`;

  // Display in message box
  messageBox.value = message;

  // Send to WhatsApp
  const whatsappNumber = whatsappInput.value.trim() || "+254762634893";
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
}

function copyToClipboard() {
  if (!messageBox.value) {
    alert("Generate a report first");
    return;
  }

  messageBox.select();
  document.execCommand("copy");

  // Show feedback
  const btn = event.target.closest("button");
  const icon = btn.querySelector("span");
  icon.textContent = "check";
  setTimeout(() => {
    icon.textContent = "content_copy";
  }, 2000);
}

// ===============================
// EVENT LISTENERS
// ===============================
amountInput.addEventListener("input", updateDashboard);

// Allow Enter key to add items
itemNameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    itemPriceInput.focus();
  }
});

itemPriceInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addItem();
  }
});

// ===============================
// INITIALIZE
// ===============================
updateDashboard();
