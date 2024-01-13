import '/style.css';
import { Todo, TodoProject, TodoList } from '/js/model.js';

const appElement = document.querySelector('#app');
const currentProjectId = 0;

///////////////////////////////////////////
let todo1 = new Todo('Test 1', 'Toto je pouze test', 2025, 1, false);
let todo2 = new Todo('Test 2', 'Toto je pouze test', 2025, 1, false);
let todo3 = new Todo('Test 3', 'Toto je pouze test', 2025, 1, false);
let todo4 = new Todo('Test 4', 'Toto je pouze test', 2025, 1, false);

const todoProject1 = new TodoProject('Škola');
todoProject1.addTodo(todo1);
todoProject1.addTodo(todo2);

const todoProject2 = new TodoProject('Práce');
todoProject2.addTodo(todo3);
todoProject2.addTodo(todo4);

const list = new TodoList();
list.addTodoProject(todoProject1);
list.addTodoProject(todoProject2);
///////////////////////////////////////////

function listAllTodos() {
  displayTodos(list.allTodos);
}

function listProjectTodos(projectId) {
  let listingProject = list.getTodoProject(projectId);
  displayTodos(listingProject.todos);
}

function displayTodos(todosArray) {
  todosArray.forEach((todo) => {
    appElement.appendChild(createTodoElement(todo));
  });
}

function createTodoElement(todoObj) {
  const todoElement = document.createElement('div');
  const todoElementContent = `<div>${todoObj.title}</div><div>${todoObj.description}</div>`;
  todoElement.innerHTML = todoElementContent;

  return todoElement;
}

