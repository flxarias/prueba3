let tasks = [];
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const totalTasksSpan = document.getElementById('totalTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');
const filterButtons = document.querySelectorAll('.filter-btn');

// Cargar tareas guardadas
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
    updateStats();
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterTasks(button.dataset.filter);
    });
});

// Funciones
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
}

function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Eliminar</button>
        `;

        // Event Listeners para cada tarea
        const checkbox = taskElement.querySelector('.task-checkbox');
        const deleteBtn = taskElement.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
            updateStats();
        });

        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
            updateStats();
        });

        tasksList.appendChild(taskElement);
    });
}

function filterTasks(filter) {
    tasksList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
    });

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">Eliminar</button>
        `;

        const checkbox = taskElement.querySelector('.task-checkbox');
        const deleteBtn = taskElement.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
            updateStats();
        });

        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
            updateStats();
        });

        tasksList.appendChild(taskElement);
    });
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStats() {
    const total = tasks.length;
    const pending = tasks.filter(task => !task.completed).length;
    totalTasksSpan.textContent = total;
    pendingTasksSpan.textContent = pending;
}
