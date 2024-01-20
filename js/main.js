import '/style.css';
import { handleProjectSwitch, currentProjectName, handleProjectAdd, projectsList, handleTodoAdd, updateList, removeProject, handleTodoCheck } from './controller';

const appElement = document.querySelector('#app');
const overviewListElement = appElement.querySelector('#overview');
const projectsListElement = appElement.querySelector('#projects');
const todosDisplay = appElement.querySelector('#todos-list');

const openProjectDialog = appElement.querySelector('.add-project');
const addProjectDialog = appElement.querySelector('#project-dialog');
const addProjectForm = addProjectDialog.querySelector('form');
const projectNameInput = addProjectDialog.querySelector('#project-name-input');
const modalCloseButtons = document.querySelectorAll('.modal-close-btn');

const openAddDialog = appElement.querySelector('#add-todo');
const addTodoDialog = appElement.querySelector('#add-dialog');
const addTodoForm = addTodoDialog.querySelector('form');
const todoTitleInput = addTodoDialog.querySelector('#todo-title-input');
const todoDetailsInput = addTodoDialog.querySelector('#todo-details-input');
const todoDuedateInput = addTodoDialog.querySelector('#todo-duedate-input');
const todoPriorityRadios = addTodoDialog.querySelectorAll('input[name="priority"]');

const warnDialog = appElement.querySelector('#warn-dialog');
const confirmDeletionButton = warnDialog.querySelector('#remove-project');

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

let projectNameToRemove = '';

/////////////////////////////////////////helpers/////////////////////////////////////////
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

function hideElement(element) {
  element.style.display = 'none';
}

function showElement(element) {
  element.style.display = 'block';
}

/////////////////////////////////////////todos/////////////////////////////////////////
function createTodo(todoObj, todoId) {
  const todoElement = createElement('div', ['todo']);
  setAttributes(todoElement, { 'data-project': todoObj.parentTitle, 'data-todoId': todoId, 'data-priority': todoObj.priority });

  const todoActions = createElement('div', ['todo-actions']);
  const checkBox = createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.addEventListener('click', handleTodoCheck);
  todoActions.appendChild(checkBox);

  const todoElementContent = createElement('div');
  const todoTitle = createElement('div', ['todo__title'], `${todoObj.title}, ${todoObj.parentTitle}, ${todoId}`);
  const todoDescription = createElement('div', ['todo__description'], todoObj.description);
  appendElements(todoElementContent, todoTitle, todoDescription);

  if (todoObj.finished) {
    checkBox.setAttribute('checked', true);
  }

  appendElements(todoElement, todoElementContent, todoActions);
  return todoElement;
}

function displayTodos(todosArrays) {
  todosArrays.forEach((todosArray) => {
    todosArray.forEach((todo, id) => {
      todosDisplay.appendChild(createTodo(todo, id));
    });
  });
}

function displayProjectTitle(project) {
  const title = createElement('h2', ['project-header'], project.title);
  todosDisplay.appendChild(title);
}

function handleEmptyProject(project) {
  const emptyProjectElement = createElement('div', ['empty-project'], 'This project is empty. Decide what to do with it');
  const actionButtons = createElement('div', ['empty-project-buttons']);

  if (project.deletable) {
    const deleteButton = createElement('button', ['button-fill'], 'Remove');
    deleteButton.addEventListener('click', () => removeProject(project.title));
    actionButtons.appendChild(deleteButton);
  }

  if (!project.isAddingRestricted) {
    const addTodoButton = createElement('button', ['button-fill'], 'Create todo');
    addTodoButton.addEventListener('click', () => {
      addTodoDialog.showModal();
    });
    actionButtons.appendChild(addTodoButton);
  } else {
    emptyProjectElement.innerHTML = 'No reason to stress';
  }

  emptyProjectElement.appendChild(actionButtons);
  todosDisplay.appendChild(emptyProjectElement);
}

function displayProjectTodos(todoList, projectName) {
  if (projectName) {
    let todosArrays = [];
    let currentProject = todoList.getTodoProjectByTitle(projectName);

    if (projectName === 'Home') {
      todosArrays = todoList.allTodos;
    } else {
      if (currentProject.isAddingRestricted) {
        hideElement(openAddDialog);
      }

      if (!currentProject.isEmpty()) {
        todosArrays.push(currentProject.todos);
      }
    }

    displayProjectTitle(currentProject);

    if (todosArrays.length !== 0) {
      displayTodos(todosArrays);
    } else {
      handleEmptyProject(currentProject);
    }
  }
  return;
}

/////////////////////////////////////////projects tabs/////////////////////////////////////////

function handleProjectRemove(e) {
  e.stopPropagation();
  let removingProjectName = e.currentTarget.getAttribute('data-project-name');

  if (!projectsList.getTodoProjectByTitle(removingProjectName).isEmpty()) {
    projectNameToRemove = removingProjectName;
    warnDialog.showModal();
  } else {
    removeProject(removingProjectName);
  }
}

function createProjectButton(todoProject) {
  const listItem = createElement('li');
  const buttonText = createElement('span', [], todoProject.title);
  buttonText.classList.add('button-content');

  const button = createElement('button', ['project-button']);
  appendElements(button, buttonText);
  button.setAttribute('data-project-name', todoProject.title);
  button.setAttribute('data-list-name', todoProject.parentList);

  listItem.appendChild(button);

  if (todoProject.deletable) {
    const buttonDelete = createElement('span', ['delete-project']);
    buttonDelete.setAttribute('data-project-name', todoProject.title);
    buttonDelete.addEventListener('click', handleProjectRemove);
    button.appendChild(buttonDelete);
  }

  button.addEventListener('click', handleProjectSwitch);

  return listItem;
}

function displayProjectButtons(todoList) {
  const projectsButtons = createElement('ul', ['projects']);
  const permanentButtons = createElement('ul', ['projects', 'project--permanent']);

  todoList.todoProjects.forEach((todoProject) => {
    let createdButton = createProjectButton(todoProject);

    if (todoProject.deletable) {
      projectsButtons.appendChild(createdButton);
    } else {
      permanentButtons.appendChild(createdButton);
    }
  });

  overviewListElement.appendChild(permanentButtons);
  projectsListElement.appendChild(projectsButtons);
}

/////////////////////////////////////////handling changes/////////////////////////////////////////
function clear() {
  todosDisplay.innerHTML = '';
  projectsListElement.innerHTML = '';
  overviewListElement.innerHTML = '';
}

function setActiveButton() {
  let activeButton = document.querySelector(`[data-project-name="${currentProjectName}"]`);
  activeButton.classList.add('active');
}

function updateInterface() {
  clear(); //updateInterface in future; decide best way for clearing or it it is even needed
  showElement(openAddDialog);
  displayProjectButtons(projectsList);
  displayProjectTodos(projectsList, currentProjectName);
  setActiveButton();
}

document.addEventListener('DOMContentLoaded', () => {
  updateList();
  updateInterface();
});

/////////////////////////////////////////modals/////////////////////////////////////////
modalCloseButtons.forEach((closeButton) => {
  closeButton.addEventListener('click', (e) => {
    let dialogToClose = e.currentTarget.closest('dialog');
    let dialogForm = dialogToClose.querySelector('form');
    if (dialogForm) {
      dialogForm.reset();
    }

    dialogToClose.close();
  });
});

////add project modal////
openProjectDialog.addEventListener('click', () => {
  addProjectDialog.showModal();
});

addProjectForm.addEventListener('submit', (e) => {
  let newProjectName = projectNameInput.value.trim();

  if (!projectsList.projectExists(newProjectName)) {
    handleProjectAdd(newProjectName);
    addProjectForm.reset();
  } else {
    alert('Project with this name already exists');
    e.preventDefault();
  }
});

////add todo modal////
openAddDialog.addEventListener('click', () => {
  addTodoDialog.showModal();
});

addTodoForm.addEventListener('submit', () => {
  let newTodoTitle = todoTitleInput.value;
  let newTodoDetails = todoDetailsInput.value;
  let newTodoDuedate = new Date(todoDuedateInput.value);
  let newTodoPriority = 'unset';

  for (let priorityRadio of todoPriorityRadios) {
    if (priorityRadio.checked) {
      newTodoPriority = priorityRadio.value;
    }
  }

  handleTodoAdd(newTodoTitle, newTodoDetails, newTodoDuedate, newTodoPriority);
  addTodoForm.reset();
});

confirmDeletionButton.addEventListener('click', () => {
  removeProject(projectNameToRemove);
  warnDialog.close();
});

export { updateInterface };
