let ul = document.querySelector('ul')
let input = document.querySelector('input')
let filterBtns = document.querySelector('.btns')
let store = Redux.createStore(reducer)

input.addEventListener('keyup', (e) => {
    if (e.target.value && e.keyCode === 13) {
        let searchVal = store.getState().filter((elm) => elm.name === e.target.value)

        searchVal.length !== 0 ? createUI(searchVal) : store.dispatch({ type: 'createTodo', todos: { name: e.target.value, isChecked: false } })

        e.target.value = ''
    }
})

function handleFilterBts(e) {
    if (e.target.nodeName === 'BUTTON') {
        switch (e.target.innerText) {
            case 'All':
                createUI(store.getState())
                break;
            case 'Active':
                createUI(store.getState().filter(todo => !todo.isChecked))
                break;
            case 'Completed':
                createUI(store.getState().filter(todo => todo.isChecked))
                break;

            case 'Clear Completed':
                store.dispatch({ type: 'deleteTodos' })
                createUI(store.getState())
                return
        }
    }
}

filterBtns.addEventListener('click', handleFilterBts)


function handleCheckBox(todo) {
    store.dispatch({ type: 'updateTodo', name: todo })
    createUI(store.getState())
}

function handleDelete(todo) {
    store.dispatch({ type: 'deleteTodo', name: todo })
    createUI(store.getState())
}



let btns = ['All', 'Active', 'Completed', 'Clear Completed']
function createUI(todos) {
    filterBtns.innerHTML = ''
    ul.innerHTML = ''
    todos.forEach(todo => {
        let li = document.createElement('li')
        let div = document.createElement('div')
        let checkbox = document.createElement('input')
        let span = document.createElement('span')
        let deleteBtn = document.createElement('strong')

        li.classList.add('text-white', 'flex', 'justify-between', 'pr-3')
        div.classList.add('flex', 'gap-x-4')

        checkbox.type = 'checkbox'
        checkbox.checked = todo.isChecked
        span.innerText = todo.name
        deleteBtn.innerHTML = '<i class="fa-solid fa-xmark cursor-pointer"></i>'

        checkbox.addEventListener('click', () => handleCheckBox(todo.name))
        deleteBtn.addEventListener('click', () => handleDelete(todo.name))

        div.append(checkbox, span)
        li.append(div, deleteBtn)
        ul.append(li)
    });

    if (todos.length !== 0) {
        btns.forEach((btn) => {
            let button = document.createElement('button')
            button.innerText = btn
            button.classList.add('py-1', 'px-3', 'rounded', 'text-white', 'bg-slate-500')
            filterBtns.append(button)
        })
    }
}



function reducer(state = [], action) {
    switch (action.type) {
        case 'createTodo':
            state.push(action.todos)
            createUI(state)
            return state

        case 'updateTodo':
            return state.filter((todo) => {
                if (todo.name === action.name) {
                    todo.isChecked = true
                    return todo
                }
                return todo
            })

        case 'deleteTodo':
            return state.filter((todo) => todo.name !== action.name)

        case 'deleteTodos':
            return state.filter((todo) => !todo.isChecked)


        default:
            return state
    }
}

