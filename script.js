if (document.getElementById("taskInput")) {
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let taskInput = document.getElementById("taskInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let searchInput = document.getElementById("searchInput");
let filterTasks = document.getElementById("filterTasks");
let taskList = document.getElementById("taskList");
let noTasks = document.getElementById("noTasks");
let taskCount = document.getElementById("taskCount");

let totalTasks = document.getElementById("totalTasks");
let pendingTasks = document.getElementById("pendingTasks");
let completedTasks = document.getElementById("completedTasks");

let footerTotal = document.getElementById("footerTotal");
let footerPending = document.getElementById("footerPending");
let footerCompleted = document.getElementById("footerCompleted");



function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function addTask() {
    let task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        name: task,
        completed: false
    });

    saveTasks();

    taskInput.value = "";

    displayTasks();
}


function displayTasks() {
    taskList.innerHTML = "";

    let search = searchInput.value.toLowerCase();
    let filter = filterTasks.value;

    let filteredTasks = tasks.filter(function(task) {

        let matchesSearch = task.name.toLowerCase().includes(search);

        let matchesFilter =
            filter === "all" ||
            (filter === "pending" && !task.completed) ||
            (filter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });


    filteredTasks.forEach(function(task) {

        let index = tasks.indexOf(task);

        let li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-name">${task.name}</span>

            <div class="task-actions">

                <button class="complete-btn"
                        onclick="completeTask(${index})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button class="edit-btn"
                        onclick="editTask(${index})">
                    Edit
                </button>

                <button class="delete-btn"
                        onclick="deleteTask(${index})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });


    if (filteredTasks.length === 0) {
        noTasks.style.display = "block";
    } else {
        noTasks.style.display = "none";
    }


    updateCounts();
}


function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;

    saveTasks();

    displayTasks();
}


function editTask(index) {
    let newTask = prompt("Edit task:", tasks[index].name);

    if (newTask !== null && newTask.trim() !== "") {

        tasks[index].name = newTask.trim();

        saveTasks();

        displayTasks();
    }
}


function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {

        tasks.splice(index, 1);

        saveTasks();

        displayTasks();
    }
}


function updateCounts() {

    let completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    let pending = tasks.length - completed;


    totalTasks.textContent = tasks.length;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;


    footerTotal.textContent = tasks.length;
    footerPending.textContent = pending;
    footerCompleted.textContent = completed;


    taskCount.textContent =
        tasks.length + (tasks.length === 1 ? " Task" : " Tasks");
}


addTaskBtn.addEventListener("click", addTask);


taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


searchInput.addEventListener("input", displayTasks);


filterTasks.addEventListener("change", displayTasks);



displayTasks();
}
