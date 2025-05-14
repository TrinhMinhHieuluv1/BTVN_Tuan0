var todoList;

window.onload = function () {
    if (localStorage.getItem('todoList') != null)
        todoList = JSON.parse(localStorage.getItem('todoList'));
    else 
        todoList = [];
    loadTodoList(todoList);
}

function changeTheme() {
    if (document.getElementsByTagName('html')[0].classList.contains('lighttheme')) {
        document.getElementsByTagName('html')[0].classList.add('darktheme');
        document.getElementsByTagName('html')[0].classList.remove('lighttheme');
        document.getElementById('theme-icon').classList.add('fa-sun');
        document.getElementById('theme-icon').classList.remove('fa-moon');
        document.getElementsByClassName('modal')[0].style.backgroundColor = 'black';
    } else {
        document.getElementsByTagName('html')[0].classList.add('lighttheme');
        document.getElementsByTagName('html')[0].classList.remove('darktheme');
        document.getElementById('theme-icon').classList.add('fa-moon');
        document.getElementById('theme-icon').classList.remove('fa-sun');
        document.getElementsByClassName('modal')[0].style.backgroundColor = 'white';
    } 
}

function loadTodoList(list) {
    var todoListElement = document.getElementsByClassName('todo-list')[0];
    todoListElement.innerHTML = '';
    if (list.length === 0) {
        todoListElement.innerHTML = `<img src='../BTVN-Week0/assets/imgs/NotFound.jpg' style="width: 400px; height: 300px;">`;
        todoListElement.style.textAlign = "center";
    }
    list.forEach(element => {
        var li = document.createElement('li');
        if (element.taskStatus === 1) {
            li.classList.add("checked");
        }
        li.innerHTML = `<label>
          <input type="checkbox" ${element.taskStatus === 1 ? 'checked' : ''} onchange="changeStatus(this, ${element.taskId})"/>
          <span class="text">` + element.taskName + `</span>
        </label>
        <div class="actions">
          <i class="fas fa-trash" onclick="DeleteTask(${element.taskId})"></i>
        </div>`;
        todoListElement.appendChild(li);
    });
}

function DeleteTask(taskId) {
    todoList = todoList.filter(t => t.taskId !== taskId);
    loadTodoList(todoList);
    save();
}

function changeStatus(sender, taskId) {
    console.log(sender.checked);
    if (sender.checked) {
        todoList.find(task => task.taskId === taskId).taskStatus = 1;
    } else {
        todoList.find(task => task.taskId === taskId).taskStatus = 0;
    }
    loadTodoList(todoList);
    save();
}

function openModal() {
    document.getElementById('modalOverlay').style.display = 'flex';
    document.getElementById('newTaskInput').value = '';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function filterTaskByConditions() {
    var tempList = todoList;
    var keyword = document.getElementById('keywordToSearchInput').value.trim().toLowerCase();
    if (keyword !== '') {
        var tempList = todoList.filter(t => t.taskName.toLowerCase().includes(keyword));
    }
    var choosenStatus = document.getElementById('statusToFilterInput').value;
    if (choosenStatus !== null && choosenStatus !== 'all') {
        if (choosenStatus === 'incompleted') {
            tempList = tempList.filter(t => t.taskStatus===0);
        }
        else {
            tempList = tempList.filter(t => t.taskStatus===1);
        }
    }
    loadTodoList(tempList);
}

function addTask() {
    var newTaskName = document.getElementById('newTaskInput').value.trim();
    if (newTaskName === '') {
        alert("Task name cannot be empty. Try again!");
    } else {
        var currentLargestId = 0;
        if (todoList.length !== 0) {
            currentLargestId = Math.max(...todoList.map(t => t.taskId));
        }
        console.log(currentLargestId);
        todoList.push({taskId: currentLargestId + 1, taskName: newTaskName, taskStatus: 0});
    }
    loadTodoList(todoList);
    save();
    closeModal();
}

function save() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}
