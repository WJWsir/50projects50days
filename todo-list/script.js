let inputEle = document.getElementsByClassName("todolist-input-entry")[0];
let listEle = document.getElementsByClassName("todolist-items")[0];

/** 回顾知识点
 * 1. Enter 按键的key 与 code
 * 2. 获取 document focus 的 DOM元素
 * 3. 鼠标事件有哪些
 * 4. toggle class 的便捷方法
 * 5. LocalStorage 刷新页面或者浏览器重启 保证未删除todo还存在
 */
document.addEventListener("DOMContentLoaded", function() {
    todolist.renderDOM();
});

// 1. 知识点：UI事件 keydown, keyup
document.addEventListener("keydown", function (event) {
    // console.log(`key: ${event.key}, code: ${event.code}`);
    // console.log(event);
    if (event.key == "Enter")
        if (inputEle.value === "" || document.activeElement != inputEle)
            return false;
        else// 表示在todo输入框focus且输入了东西时按下Enter键    
        {
            let listItem = document.createElement("div");
            listItem.classList.add("todolist-item");
            listItem.textContent = inputEle.value;
            listEle.appendChild(listItem);
            inputEle.value = null;//清空 Input 输入的内容

            // 同步更新到浏览器存储对象
            todolist.updateLS();
        }
});

// 2. 知识点：UI事件 mousedown, mouseup, click, contextmenu
document.addEventListener("click", function (event) {
    if (event.target.className.includes("todolist-item")) {
        let listItemEle = event.target;
        //Left click to toggle completed.
        listItemEle.classList.toggle('completed');
    }
    else
        return;
});
document.addEventListener("contextmenu", function (event) {
    if (event.target.className.includes("todolist-item")) {
        let listItemEle = event.target;
        //Right click to delete todo.
        listItemEle.remove();
        event.preventDefault();// 阻止默认打开浏览器右键菜单行为

        // 同步更新到浏览器存储对象
        todolist.updateLS();
    }
    else
        return;
});

// 3. 知识点：浏览器存储对象 LocalStorage
let todolist = (function () {
    let _todolist = function () {
        this.updateLS = function () {
            const todos = new Array();
            [].forEach.call(listEle.children, todoEle => todos.push({
                text: todoEle.innerText,
                completed: todoEle.classList.contains('completed')
            }));
            localStorage.setItem("todoList", JSON.stringify(todos));
        };
        this.renderDOM = function () {
            const todos = JSON.parse(localStorage.getItem("todoList"));
            listEle.innerHTML = null; // 清空 todo List
            todos.forEach(todoEle => {
                let listItem = document.createElement("div");
                listItem.classList.add("todolist-item");
                todoEle.completed ? listItem.classList.add("completed") : null;
                listItem.textContent = todoEle.text;
                listEle.appendChild(listItem);
            })
        }
    };
    return new _todolist();
})();
