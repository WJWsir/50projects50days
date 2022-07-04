let Todo = function (data) {
    this.identity = data.identity;
    this.textContent = data.textContent;
    this.isCompleted = data.isCompleted;
}

let filtor = {
    all: function (todo) {
        return true;
    },
    active: function (todo) {
        return todo.isCompleted == false;
    },
    completed: function (todo) {
        return todo.isCompleted;
    }
}

let todosLS = {
    fetch: function () {
        let todos =  JSON.parse(localStorage.getItem("todos")) || [];
        // 约定unique identity从 0 开始依次增大
        todos.forEach((todo, index) => {
            todo.identity = index;
        });
        // 记录下一个新增的 uinique identity
        todosLS.uid = todos.length;
        return todos;
    },
    save: function (todos) { localStorage.setItem("todos", JSON.stringify(todos)); }
};

localStorage.getItem("todos");

let app = new Vue({
    el: ".wrapper",
    data() {
        return {
            todos: todosLS.fetch(),
            // [
            //     new Todo({ identity: 1, textContent: "读书", isCompleted: false }),
            //     new Todo({ identity: 2, textContent: "健身", isCompleted: true }),
            // ],
            filterType: "all",
            newTodo: '',
            editedTodo: null,
        }
    },
    watch: {
        todos: {
            handler: function (todos) {
                todosLS.save(todos);
            },
            deep: true
        }
    },
    methods: {
        addTodo: function () {
            var value = this.newTodo && this.newTodo.trim()
            if (!value) {
                return;
            }
            this.todos.push(new Todo({
                identity: todosLS.uid++,// 先赋值，后+1
                textContent: value,
                isCompleted: false
            }));
            this.newTodo = ''
        },
        deleteTodo: function (identity) {
            this.todos = this.todos.filter(todo => todo.identity != identity);
        },
        editTodo: function (todo) {
            this.beforeEditTodoCache = todo.textContent;
            this.editedTodo = todo;
        },
        doneEdit: function (todo) {
            this.editedTodo = null;
            if (!todo.textContent) {
                this.deleteTodo(todo.identity);
            }
        },
        cancelEdit: function (todo) {
            todo.textContent = this.beforeEditTodoCache;
            this.editedTodo = null;
        },
        clearCompletedTodos: function () {
            this.todos = this.todos.filter(todo => filtor["active"](todo));
        }
    },
    computed: {
        filteredTodos: function () {
            return this.todos.filter(todo => filtor[this.filterType](todo));
        },
        remaining: function () {
            return this.todos.filter(todo => filtor["active"](todo)).length;
        },
        allDone: {
            get: function () {
                return this.remaining === 0;
            },
            set: function (value) {
                this.todos.forEach(todo => todo.isCompleted = value);
            }
        }
    },
    directives: {
        "todo-focus": function (el, binding) {
            if (binding.value) {
                el.focus();
            }
        }
    }
});

window.addEventListener('hashchange', onHashChange);
// 处理路由
function onHashChange() {
    let hash = window.location.hash.replace(/#\/?/, '');
    if (filtor[hash]) {
        app.filterType = hash;
    } else {
        window.location.hash = '';
        app.filterType = 'all';
    }
}