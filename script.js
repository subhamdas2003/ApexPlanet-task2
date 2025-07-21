// ======= Contact Form with Toast =======
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const toast = document.getElementById("toast");

  if (!name || !email || !message) {
    showToast("Please fill in all fields!", "error");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    showToast("Invalid email format!", "error");
    return;
  }

  showToast("Message sent successfully!", "success");
  this.reset();
});

function showToast(msg, type) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  toast.style.background = type === "error" ? "#f44336" : "#4caf50";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// ======= To-Do Logic with Priority and Storage =======
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

function addTask() {
  const text = document.getElementById("todoInput").value.trim();
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    completed: false,
    priority,
    dueDate
  };

  todos.push(task);
  saveAndRender();
  document.getElementById("todoInput").value = "";
  document.getElementById("dueDate").value = "";
}

function renderTasks() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";
  let filtered = todos;

  if (filter === "completed") filtered = todos.filter(t => t.completed);
  if (filter === "pending") filtered = todos.filter(t => !t.completed);

  const search = document.getElementById("searchBox").value.toLowerCase();
  filtered = filtered.filter(t => t.text.toLowerCase().includes(search));

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `
      <span onclick="toggleComplete(${task.id})">
        ${task.text} (${task.priority}${task.dueDate ? `, due: ${task.dueDate}` : ""})
      </span>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    list.appendChild(li);
  });
  updateStats();
}

function toggleComplete(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveAndRender();
}

function deleteTask(id) {
  todos = todos.filter(t => t.id !== id);
  saveAndRender();
}

function clearTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todos = [];
    saveAndRender();
  }
}

function filterTasks(type) {
  filter = type;
  renderTasks();
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-completed").textContent = completed;
  document.getElementById("stat-pending").textContent = pending;
}

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTasks();
}

// ======= Dark Mode Toggle =======
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("searchBox").addEventListener("input", renderTasks);
window.onload = renderTasks;