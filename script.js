let tasks = [];
let currentFilter = 'all';
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const totalTasksSpan = document.getElementById('totalTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');
const filterButtons = document.querySelectorAll('.filter-btn');
const deleteCompletedBtn = document.getElementById('deleteCompletedBtn');

// Cargar tareas guardadas de forma segura
const savedTasks = localStorage.getItem('tasks');
if (savedTasks) {
    try {
        tasks = JSON.parse(savedTasks);
    } catch (e) {
        console.error('Error parsing tasks from localStorage', e);
        localStorage.removeItem('tasks');
        tasks = [];
    }
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
        renderTasks(button.dataset.filter);
    });
});

if (deleteCompletedBtn) {
    deleteCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStats();
    });
}

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

function renderTasks(filter = currentFilter) {
    currentFilter = filter;
    tasksList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
    });

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Eliminar</button>
        `;

        // Event Listeners para cada tarea
        const checkbox = taskElement.querySelector('.task-checkbox');
        const editBtn = taskElement.querySelector('.edit-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
            updateStats();
        });

        editBtn.addEventListener('click', () => {
            const newText = prompt('Editar tarea', task.text);
            if (newText !== null) {
                const trimmed = newText.trim();
                if (trimmed !== '') {
                    task.text = trimmed;
                    saveTasks();
                    renderTasks();
                    updateStats();
                }
            }
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
