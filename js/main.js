import '/style.css';
import { handleProjectSwitch, handleProjectRemove, currentProjectName, list } from './controller';

const appElement = document.querySelector('#app');
const overviewList = appElement.querySelector('#overview');
const projectsList = appElement.querySelector('#projects');
const todosDisplay = appElement.querySelector('.todos');

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
    todosDisplay.appendChild(createTodo(todo, id));
  });
}

function listProjectTodos(projectName) {
  let listingProject = list.getTodoProjectByTitle(projectName);
  displayTodos(listingProject.todos);
}

function createProjectButton(todoProject) {
  const listItem = createElement('li');
  const buttonText = createElement('span', [], todoProject.title);

  const buttonDelete = createElement('span', ['delete-project']);
  buttonDelete.setAttribute('data-project-name', todoProject.title);
  buttonDelete.addEventListener('click', handleProjectRemove);

  const button = createElement('button', ['project-button']);
  appendElements(button, buttonText, buttonDelete);
  button.setAttribute('data-project-name', todoProject.title);
  button.addEventListener('click', handleProjectSwitch);
  listItem.appendChild(button);

  return listItem;
}

function displayProjectButtons() {
  const buttonsList = createElement('ul', ['projects']);

  list.todoProjects.forEach((todoProject) => {
    buttonsList.appendChild(createProjectButton(todoProject));
  });

  projectsList.appendChild(buttonsList);
}

function clear() {
  todosDisplay.innerHTML = '';
  projectsList.innerHTML = '';
}

function update() {
  console.log(currentProjectName);
  clear(); //update in future; decide best way for clearing or it it is even needed
  displayProjectButtons();
  listProjectTodos(currentProjectName);
}

document.addEventListener('DOMContentLoaded', () => {
  displayProjectButtons();
});

export { update };
