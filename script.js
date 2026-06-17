// TODO 資料結構
let todos = [];
let currentDescriptionId = null;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeTodos();
    attachEventListeners();
    renderTodos();
});

// 初始化預設的 TODOs
function initializeTodos() {
    todos = [
        {
            id: 1,
            text: 'todo1',
            description: '這是第一個 TODO 項目的描述',
            completed: false,
            createdAt: new Date().toLocaleString('zh-TW')
        },
        {
            id: 2,
            text: 'todo2',
            description: '這是第二個 TODO 項目的描述',
            completed: false,
            createdAt: new Date().toLocaleString('zh-TW')
        }
    ];
}

// 附加事件監聽器
function attachEventListeners() {
    const addBtn = document.getElementById('addBtn');
    const todoInput = document.getElementById('todoInput');
    const descriptionInput = document.getElementById('descriptionInput');
    
    // 新增 TODO 按鈕
    addBtn.addEventListener('click', addTodo);
    
    // 按 Enter 鍵時也可以新增
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
}

// 新增 TODO
function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const descriptionInput = document.getElementById('descriptionInput');
    
    const text = todoInput.value.trim();
    const description = descriptionInput.value.trim();
    
    if (text === '') {
        alert('請輸入 TODO 名稱');
        todoInput.focus();
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: text,
        description: description || '無描述',
        completed: false,
        createdAt: new Date().toLocaleString('zh-TW')
    };
    
    todos.push(newTodo);
    
    // 清空輸入框
    todoInput.value = '';
    descriptionInput.value = '';
    todoInput.focus();
    
    // 重新渲染
    renderTodos();
}

// 渲染 TODO 列表
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-message">暫無 TODO 項目，開始新增一個吧！</div>';
        return;
    }
    
    todos.forEach((todo) => {
        const todoItem = createTodoItem(todo);
        todoList.appendChild(todoItem);
    });
}

// 建立 TODO 項目元素
function createTodoItem(todo) {
    const item = document.createElement('div');
    item.className = `todo-item ${todo.completed ? 'checked' : ''}`;
    item.dataset.id = todo.id;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleTodo(todo.id);
    });
    
    const content = document.createElement('div');
    content.className = 'todo-content';
    content.style.cursor = 'pointer';
    
    const text = document.createElement('div');
    text.className = 'todo-text';
    text.textContent = todo.text;
    
    const date = document.createElement('div');
    date.className = 'todo-date';
    date.textContent = todo.createdAt;
    
    content.appendChild(text);
    content.appendChild(date);
    
    // 點擊 TODO item 顯示 description
    content.addEventListener('click', () => {
        showDescription(todo);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '刪除';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(todo.id);
    });
    
    item.appendChild(checkbox);
    item.appendChild(content);
    item.appendChild(deleteBtn);
    
    return item;
}

// 切換 TODO 完成狀態
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

// 刪除 TODO
function deleteTodo(id) {
    const index = todos.findIndex(t => t.id === id);
    if (index > -1) {
        todos.splice(index, 1);
        renderTodos();
        
        // 如果刪除的是當前顯示的 description，則隱藏
        if (currentDescriptionId === id) {
            hideDescription();
        }
    }
}

// 顯示 description
function showDescription(todo) {
    const descriptionSection = document.getElementById('descriptionSection');
    currentDescriptionId = todo.id;
    
    descriptionSection.innerHTML = `
        <div class="description-title">📝 ${todo.text}</div>
        <div class="description-content">${todo.description}</div>
    `;
    
    descriptionSection.classList.add('show');
}

// 隱藏 description
function hideDescription() {
    const descriptionSection = document.getElementById('descriptionSection');
    descriptionSection.classList.remove('show');
    currentDescriptionId = null;
}
