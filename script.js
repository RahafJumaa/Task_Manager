let taskIdCounter = parseInt(localStorage.getItem('taskIdCounter')) || 1;

(function() {
    function Task(description) {
        this.id = taskIdCounter++;
        this.description = description;
        this.completed = false;
        saveTaskIdCounter();  
    }

    function saveTaskIdCounter() {
        localStorage.setItem('taskIdCounter', taskIdCounter);
    }

    function TaskManager() {
        this.tasks = this.loadTasks();
    }

    TaskManager.prototype.loadTasks = function() {
        const tasksJSON = localStorage.getItem('tasks');
        if (tasksJSON) {
            try {
                return JSON.parse(tasksJSON);
            } catch (e) {
                console.error('Error parsing tasks from localStorage. Starting with an empty task list.');
                return [];
            }
        }
        return [];
    };

    TaskManager.prototype.saveTasks = function() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks, null, 2));
    };

    TaskManager.prototype.addTask = function(description) {
        const task = new Task(description);
        this.tasks.push(task);
        this.saveTasks();
        console.log(`Task added: "${task.description}"`);
    };

    TaskManager.prototype.listTasks = function() {
        if (this.tasks.length === 0) {
            console.log('No tasks available.');
            return;
        }

        console.log('Tasks:');
        this.tasks.forEach(task => {
            const status = task.completed ? 'Completed' : 'Not Completed';
            console.log(`${task.id}. ${task.description} [${status}]`);
        });
    };

    TaskManager.prototype.toggleTask = function(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            console.log(`Task ID ${id} marked as ${task.completed ? 'Completed' : 'Not Completed'}.`);
        } else {
            console.log(`Task with ID ${id} not found.`);
        }
    };

    TaskManager.prototype.deleteTask = function(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(t => t.id !== id);
        if (this.tasks.length < initialLength) {
            this.saveTasks();
            console.log(`Task ID ${id} deleted successfully.`);
        } else {
            console.log(`Task with ID ${id} not found.`);
        }
    };

    TaskManager.prototype.updateTask = function(id, newDescription) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.description = newDescription;
            this.saveTasks();
            console.log(`Task ID ${id} updated successfully.`);
        } else {
            console.log(`Task with ID ${id} not found.`);
        }
    };

    const taskManager = new TaskManager();
    const mainMenuOptions = [
        'Add Task',
        'View Tasks',
        'Update Task Description',
        'Toggle Task Status',
        'Delete Task',
        'Exit'
    ];

    function mainMenu() {
        const action = prompt(`Enter your choice (1-6):`);

        if (action === null) {
            console.log('Exiting Task Manager.');
            return;
        }

        switch (action.trim()) {
            case '1':
                addTaskPrompt();
                break;
            case '2':
                taskManager.listTasks();
                mainMenu();
                break;
            case '3':
                toggleTaskPrompt();
                break;
            case '4':
                updateTaskPrompt();
                break;
            case '5':
                deleteTaskPrompt();
                break;
            case '6':
                console.log('Exiting Task Manager...');
                return;
            default:
                alert('Invalid choice, please enter a number between 1 and 6.');
                mainMenu();
        }
    }

    function addTaskPrompt() {
        const description = prompt('Enter the task description:');
        if (description === null) {
            console.log('Task addition cancelled.');
            mainMenu();
            return;
        }
        const trimmedDesc = description.trim();
        if (trimmedDesc === '') {
            alert('Description cannot be empty.');
            mainMenu();
            return;
        }
        taskManager.addTask(trimmedDesc);
        mainMenu();
    }

    function updateTaskPrompt() {
        if (taskManager.tasks.length === 0) {
            console.log('No tasks available to update.');
            mainMenu();
            return;
        }

        const idInput = prompt('Enter the ID of the task you want to update:');
        if (idInput === null) {
            console.log('Update cancelled.');
            mainMenu();
            return;
        }

        const id = parseInt(idInput.trim());
        if (isNaN(id)) {
            alert('Please enter a valid numerical ID.');
            mainMenu();
            return;
        }

        const newDescription = prompt('Enter the new description:');
        if (newDescription === null) {
            console.log('Update cancelled.');
            mainMenu();
            return;
        }

        const trimmedDesc = newDescription.trim();
        if (trimmedDesc === '') {
            alert('Description cannot be empty.');
            mainMenu();
            return;
        }

        taskManager.updateTask(id, trimmedDesc);
        mainMenu();
    }

    function toggleTaskPrompt() {
        if (taskManager.tasks.length === 0) {
            console.log('No tasks available to toggle.');
            mainMenu();
            return;
        }

        const idInput = prompt('Enter the ID of the task you want to toggle:');
        if (idInput === null) {
            console.log('Toggle cancelled.');
            mainMenu();
            return;
        }

        const id = parseInt(idInput.trim());
        if (isNaN(id)) {
            alert('Please enter a valid numerical ID.');
            mainMenu();
            return;
        }

        taskManager.toggleTask(id);
        mainMenu();
    }

    function deleteTaskPrompt() {
        if (taskManager.tasks.length === 0) {
            console.log('No tasks available to delete.');
            mainMenu();
            return;
        }

        const idInput = prompt('Enter the task ID to delete:');
        if (idInput === null) {
            console.log('Deletion cancelled.');
            mainMenu();
            return;
        }

        const id = parseInt(idInput.trim());
        if (isNaN(id)) {
            alert('Please enter a valid numerical ID.');
            mainMenu();
            return;
        }
        taskManager.deleteTask(id);
        mainMenu();
    }
    
    console.log(`Task Manager Menu:
        1. Add Task
        2. View Tasks
        3. Toggle Task Completion
        4. Edit Task
        5. Delete Task
        6. Exit`);
    mainMenu();

})();
