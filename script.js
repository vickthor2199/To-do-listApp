// Todo List App JavaScript
class TodoApp {
    constructor() {
        this.todos = [];
        this.todoInput = document.getElementById('todoInput');
        this.addButton = document.querySelector('.btn');
        this.todoList = document.getElementById('todoList');
        this.deleteButton = document.getElementById('deleteButton');
        this.counterElement = document.querySelector('.counter-container span');
        
        this.init();
    }

    init() {
        // Load todos from localStorage
        this.loadTodos();
        
        // Event listeners
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        this.deleteButton.addEventListener('click', () => this.deleteAllTodos());
        
        // Initial render
        this.renderTodos();
        this.updateCounter();
    }

    addTodo() {
        const todoText = this.todoInput.value.trim();
        
        if (todoText === '') {
            alert('Please enter a todo item!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: todoText,
            completed: false,
            createdAt: new Date().toLocaleDateString()
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.renderTodos();
        this.updateCounter();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos();
        this.renderTodos();
        this.updateCounter();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
        this.updateCounter();
    }

    deleteAllTodos() {
        if (this.todos.length === 0) {
            alert('No todos to delete!');
            return;
        }

        if (confirm('Are you sure you want to delete all todos?')) {
            this.todos = [];
            this.saveTodos();
            this.renderTodos();
            this.updateCounter();
        }
    }

    renderTodos() {
        if (this.todos.length === 0) {
            this.todoList.innerHTML = '<p style="color: #8f98a8; text-align: center; padding: 2rem;">No todos yet. Add one above!</p>';
            return;
        }

        this.todoList.innerHTML = this.todos.map(todo => `
            <div class="todo-item" style="
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-bottom: 1px solid var(--grey-border);
                ${todo.completed ? 'opacity: 0.6;' : ''}
            ">
                <input 
                    type="checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    onchange="todoApp.toggleTodo(${todo.id})"
                    style="
                        width: 1.2rem;
                        height: 1.2rem;
                        cursor: pointer;
                    "
                >
                <div style="flex: 1;">
                    <p style="
                        margin: 0;
                        color: ${todo.completed ? '#8f98a8' : 'var(--dark)'};
                        text-decoration: ${todo.completed ? 'line-through' : 'none'};
                        font-weight: ${todo.completed ? 'normal' : '500'};
                    ">${todo.text}</p>
                    <small style="color: #8f98a8;">${todo.createdAt}</small>
                </div>
                <button 
                    onclick="todoApp.deleteTodo(${todo.id})"
                    style="
                        background: #ff4757;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 0.25rem;
                        cursor: pointer;
                        font-size: 0.8rem;
                    "
                    onmouseover="this.style.background='#ff3838'"
                    onmouseout="this.style.background='#ff4757'"
                >Delete</button>
            </div>
        `).join('');
    }

    updateCounter() {
        const totalTodos = this.todos.length;
        const completedTodos = this.todos.filter(todo => todo.completed).length;
        const activeTodos = totalTodos - completedTodos;

        // Update the counter display
        const counterContainer = document.querySelector('.counter-container');
        if (counterContainer) {
            counterContainer.innerHTML = `
                <p><span>${totalTodos}</span> Items Total</p>
                <p style="color: var(--green);"><span>${completedTodos}</span> Completed</p>
                <p style="color: var(--blue);"><span>${activeTodos}</span> Active</p>
            `;
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Additional utility functions
function clearCompleted() {
    if (todoApp.todos.filter(todo => todo.completed).length === 0) {
        alert('No completed todos to clear!');
        return;
    }
    
    if (confirm('Delete all completed todos?')) {
        todoApp.todos = todoApp.todos.filter(todo => !todo.completed);
        todoApp.saveTodos();
        todoApp.renderTodos();
        todoApp.updateCounter();
    }
}

function showStats() {
    const total = todoApp.todos.length;
    const completed = todoApp.todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    alert(`📊 Todo Statistics:
    
Total Todos: ${total}
Completed: ${completed}
Active: ${active}
Completion Rate: ${completionRate}%`);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to delete all
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        todoApp.deleteAllTodos();
    }
    
    // Ctrl/Cmd + S to show stats
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showStats();
    }
});