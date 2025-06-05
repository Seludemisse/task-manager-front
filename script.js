// Initial tasks array
let tasks = [
    { id: 1, title: "Buy groceries", completed: false },
    { id: 2, title: "Read a book", completed: true },
    { id: 3, title: "Complete internship challenge", completed: false },
    { id: 4, title: "Learn JavaScript", completed: true },
  ]
  
  // Current filter state
  let currentFilter = "all"
  
  // DOM elements
  const taskForm = document.getElementById("taskForm")
  const taskInput = document.getElementById("taskInput")
  const tasksContainer = document.getElementById("tasksContainer")
  const emptyState = document.getElementById("emptyState")
  const errorMessage = document.getElementById("errorMessage")
  const filterButtons = document.querySelectorAll(".filter-btn")
  
  // Counter elements
  const allCount = document.getElementById("allCount")
  const pendingCount = document.getElementById("pendingCount")
  const completedCount = document.getElementById("completedCount")
  
  // Initialize the app
  document.addEventListener("DOMContentLoaded", () => {
    renderTasks()
    updateCounts()
    setupEventListeners()
  })
  
  // Setup event listeners
  function setupEventListeners() {
    // Form submission
    taskForm.addEventListener("submit", handleAddTask)
  
    // Filter buttons
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", handleFilterChange)
    })
  }
  
  // Handle adding new task
  function handleAddTask(e) {
    e.preventDefault()
  
    const title = taskInput.value.trim()
  
    // Validation
    if (!title) {
      showError("Task title cannot be empty!")
      return
    }
  
    if (title.length < 3) {
      showError("Task title must be at least 3 characters long!")
      return
    }
  
    if (title.length > 100) {
      showError("Task title must be less than 100 characters!")
      return
    }
  
    // Check for duplicate tasks
    if (tasks.some((task) => task.title.toLowerCase() === title.toLowerCase())) {
      showError("This task already exists!")
      return
    }
  
    // Add new task
    const newTask = {
      id: Date.now(), // Simple ID generation
      title: title,
      completed: false,
    }
  
    tasks.unshift(newTask) // Add to beginning of array
    taskInput.value = ""
    hideError()
    renderTasks()
    updateCounts()
  
    // Show success feedback
    showSuccessMessage("Task added successfully!")
  }
  
  // Handle filter change
  function handleFilterChange(e) {
    const filter = e.target.dataset.filter
    currentFilter = filter
  
    // Update active filter button
    filterButtons.forEach((btn) => btn.classList.remove("active"))
    e.target.classList.add("active")
  
    renderTasks()
  }
  
  // Render tasks based on current filter
  function renderTasks() {
    const filteredTasks = getFilteredTasks()
  
    if (filteredTasks.length === 0) {
      tasksContainer.innerHTML = ""
      emptyState.classList.remove("hidden")
      updateEmptyStateMessage()
      return
    }
  
    emptyState.classList.add("hidden")
  
    tasksContainer.innerHTML = filteredTasks
      .map(
        (task) => `
          <div class="task-item ${task.completed ? "completed" : ""}" data-id="${task.id}">
              <div class="task-content">
                  <span class="task-status">${task.completed ? "✅" : "⏳"}</span>
                  <span class="task-title">${escapeHtml(task.title)}</span>
              </div>
              <div class="task-actions">
                  <button class="btn ${task.completed ? "btn-success" : "btn-success"}" onclick="toggleTask(${task.id})">
                      ${task.completed ? "↩️ Undo" : "✅ Complete"}
                  </button>
                  <button class="btn btn-danger" onclick="deleteTask(${task.id})">
                      🗑️ Delete
                  </button>
              </div>
          </div>
      `,
      )
      .join("")
  }
  
  // Get filtered tasks based on current filter
  function getFilteredTasks() {
    switch (currentFilter) {
      case "completed":
        return tasks.filter((task) => task.completed)
      case "pending":
        return tasks.filter((task) => !task.completed)
      default:
        return tasks
    }
  }
  
  // Toggle task completion status
  function toggleTask(id) {
    const task = tasks.find((task) => task.id === id)
    if (task) {
      task.completed = !task.completed
      renderTasks()
      updateCounts()
  
      const message = task.completed ? "Task marked as completed!" : "Task marked as pending!"
      showSuccessMessage(message)
    }
  }
  
  // Delete task
  function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
      tasks = tasks.filter((task) => task.id !== id)
      renderTasks()
      updateCounts()
      showSuccessMessage("Task deleted successfully!")
    }
  }
  
  // Update task counts
  function updateCounts() {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const pending = total - completed
  
    allCount.textContent = total
    completedCount.textContent = completed
    pendingCount.textContent = pending
  }
  
  // Update empty state message based on current filter
  function updateEmptyStateMessage() {
    const emptyIcon = document.querySelector(".empty-icon")
    const emptyTitle = document.querySelector(".empty-state h3")
    const emptyText = document.querySelector(".empty-state p")
  
    switch (currentFilter) {
      case "completed":
        emptyIcon.textContent = "🎉"
        emptyTitle.textContent = "No completed tasks!"
        emptyText.textContent = "Complete some tasks to see them here."
        break
      case "pending":
        emptyIcon.textContent = "✨"
        emptyTitle.textContent = "No pending tasks!"
        emptyText.textContent = "Great job! All tasks are completed."
        break
      default:
        emptyIcon.textContent = "📋"
        emptyTitle.textContent = "No tasks yet!"
        emptyText.textContent = "Add your first task above to get started."
    }
  }
  
  // Show error message
  function showError(message) {
    errorMessage.textContent = message
    errorMessage.classList.add("show")
    taskInput.style.borderColor = "#dc3545"
  }
  
  // Hide error message
  function hideError() {
    errorMessage.classList.remove("show")
    taskInput.style.borderColor = "#e1e5e9"
  }
  
  // Show success message
  function showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement("div")
    successDiv.className = "success-message"
    successDiv.textContent = message
    successDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #28a745;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          z-index: 1000;
          animation: slideIn 0.3s ease;
      `
  
    document.body.appendChild(successDiv)
  
    // Remove after 3 seconds
    setTimeout(() => {
      successDiv.style.animation = "slideOut 0.3s ease"
      setTimeout(() => {
        document.body.removeChild(successDiv)
      }, 300)
    }, 3000)
  }
  
  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
  
  // Add CSS animations
  const style = document.createElement("style")
  style.textContent = `
      @keyframes slideIn {
          from {
              transform: translateX(100%);
              opacity: 0;
          }
          to {
              transform: translateX(0);
              opacity: 1;
          }
      }
      
      @keyframes slideOut {
          from {
              transform: translateX(0);
              opacity: 1;
          }
          to {
              transform: translateX(100%);
              opacity: 0;
          }
      }
  `
  document.head.appendChild(style)
  