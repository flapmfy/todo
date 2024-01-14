import '/style.css';
import { Todo, TodoProject, TodoList } from './model';
import { handleProjectSwitch, currentProjectName } from './controller';

const appElement = document.querySelector('#app');

//display sorted
//decide HTML structure
//add checkboxes for each todo, import something for working with dates
//add interface for adding projects and todos to them
//what will happen if user removes current project
//add default projects for todos (all, finished, due soon, notes?)
//save to local browser storage
//refactor, SOLID principles

//* try drag and drop for reordering todos */
//* add calendar for picking due date of todo */

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

function createElement(elementName, classes = [], content = '') {
  const htmlElement = document.createElement(elementName);
  htmlElement.innerText = content;
  htmlElement.classList.add(...classes);
  return htmlElement;
}

function appendElements(htmlElement, ...elements) {
  elements.forEach((element) => {
    htmlElement.appendChild(element);
  });
}

function setAttributes(htmlElement, attributes) {
  for (let attribute in attributes) {
    htmlElement.setAttribute(attribute, attributes[attribute]);
  }
}

// function listAllTodos() {
//   displayTodos(list.allTodos);
// }

function createTodo(todoObj, todoId) {
  const todoElement = createElement('div', ['todo']);
  setAttributes(todoElement, { 'data-project': todoObj.parentTitle, 'data-todoId': todoId });

  const todoElementContent = createElement('div');
  const todoTitle = createElement('div', ['todo__title'], todoObj.title);
  const todoDescription = createElement('div', ['todo__description'], todoObj.description);
  appendElements(todoElementContent, todoTitle, todoDescription);
  todoElement.appendChild(todoElementContent);

  return todoElement;
}

function displayTodos(todosArray) {
  todosArray.forEach((todo, id) => {
    appElement.appendChild(createTodo(todo, id));
  });
}

function listProjectTodos(projectName) {
  let listingProject = list.getTodoProjectByTitle(projectName);
  displayTodos(listingProject.todos);
}

function createProjectButton(todoProject) {
  const listItem = createElement('li');
  const button = createElement('button', [], todoProject.title);
  button.setAttribute('data-projectName', todoProject.title);
  button.addEventListener('click', handleProjectSwitch);
  listItem.appendChild(button);

  return listItem;
}

function displayProjectButtons() {
  const buttonsList = createElement('ul', ['projects']);

  list.todoProjects.forEach((todoProject) => {
    buttonsList.appendChild(createProjectButton(todoProject));
  });

  appElement.appendChild(buttonsList);
}

function clear() {
  appElement.innerHTML = '';
}

function update() {
  clear(); //update in future; decide best way for clearing or it it is even needed
  displayProjectButtons();
  listProjectTodos(currentProjectName);
}

document.addEventListener('DOMContentLoaded', () => {
  displayProjectButtons();
});

export { update };
