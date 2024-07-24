export const javascript = `document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const todoText = todoInput.value.trim();
        if (todoText) {
            addTodo(todoText);
            todoInput.value = '';
            todoInput.focus();
        }
    });

    function addTodo(text) {
        const li = document.createElement('li');
        li.textContent = text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }
});
`;
