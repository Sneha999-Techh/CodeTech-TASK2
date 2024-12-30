        const taskInput = document.getElementById('taskInput');
        const todoList = document.getElementById('todoList');
        const savedTasksList = document.getElementById('savedTasks');

        // Load tasks from localStorage for today
        document.addEventListener('DOMContentLoaded', () => {
            loadTasks();
            loadSavedTasks();
        });

        function getTodayKey() {
            const today = new Date().toISOString().split('T')[0];
            return `tasks_${today}`;
        }

        function addTask() {
            const taskText = taskInput.value.trim();
            if (!taskText) {
                alert('Please enter a task.');
                return;
            }

            const task = { id: Date.now(), text: taskText };
            const tasks = getTasksFromStorage();
            tasks.push(task);
            saveTasksToStorage(tasks);
            taskInput.value = '';
            renderTask(task);
        }

        function renderTask(task) {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.id = task.id;
            li.innerHTML = `
                <span>${task.text}</span>
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            `;
            todoList.appendChild(li);
        }

        function getTasksFromStorage() {
            return JSON.parse(localStorage.getItem(getTodayKey())) || [];
        }

        function saveTasksToStorage(tasks) {
            localStorage.setItem(getTodayKey(), JSON.stringify(tasks));
        }

        function deleteTask(id) {
            const tasks = getTasksFromStorage().filter(task => task.id !== id);
            saveTasksToStorage(tasks);
            document.querySelector(`li[data-id='${id}']`).remove();
        }

        function editTask(id) {
            const li = document.querySelector(`li[data-id='${id}']`);
            const span = li.querySelector('span');
            const newTaskText = prompt('Edit your task:', span.textContent);
            if (newTaskText === null || newTaskText.trim() === '') return;

            span.textContent = newTaskText.trim();
            const tasks = getTasksFromStorage();
            const taskIndex = tasks.findIndex(task => task.id === id);
            tasks[taskIndex].text = newTaskText.trim();
            saveTasksToStorage(tasks);
        }

        function loadTasks() {
            const tasks = getTasksFromStorage();
            tasks.forEach(task => renderTask(task));
        }

        function saveTasksForDay() {
            const tasks = getTasksFromStorage();
            const today = new Date().toLocaleDateString();
            if (tasks.length === 0) {
                alert('No tasks to save for today.');
                return;
            }

            const savedTasks = JSON.parse(localStorage.getItem('savedTasks')) || [];
            savedTasks.push({ date: today, tasks });

            // Save the tasks to the saved tasks section
            localStorage.setItem('savedTasks', JSON.stringify(savedTasks));

            // Clear the tasks from local storage and the UI
            localStorage.removeItem(getTodayKey());
            todoList.innerHTML = '';  // Clear the task list UI

            alert(`Tasks for ${today} have been saved.`);
            loadSavedTasks();
        }

        function loadSavedTasks() {
            savedTasksList.innerHTML = '';
            const savedTasks = JSON.parse(localStorage.getItem('savedTasks')) || [];
            savedTasks.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `${entry.date}: ${entry.tasks.map(t => t.text).join(', ')}`;
                savedTasksList.appendChild(li);
            });
        }

        // Clear all saved tasks
        function clearAllSavedTasks() {
            if (confirm('Are you sure you want to clear all saved tasks?')) {
                localStorage.removeItem('savedTasks');
                savedTasksList.innerHTML = ''; // Clear the saved tasks UI
                alert('All saved tasks have been cleared.');
            }
        }
    