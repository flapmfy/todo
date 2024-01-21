import '/style.css';
import { handleProjectSwitch, currentProjectName, handleProjectAdd, projectsList, handleTodoAdd, removeProject, handleTodoCheck, currentDate } from './controller';

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
function createTodo(todoObj) {
  const todoElement = createElement('div', ['todo']);
  const todoElementContent = createElement('div', ['todo__content']);
  const todoActions = createElement('div', ['todo-actions']);
  setAttributes(todoElement, { 'data-project': todoObj.parentTitle, 'data-todoId': todoObj.todoId, 'data-priority': todoObj.priority });

  const checkBox = createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.addEventListener('click', handleTodoCheck);
  todoElementContent.appendChild(checkBox);

  const todoTitle = createElement('div', ['todo__title'], `${todoObj.title}`);
  appendElements(todoElementContent, todoTitle);

  if (todoObj.finished) {
    checkBox.setAttribute('checked', true);
  }

  if (todoObj.isDue(currentDate) && !todoObj.finished) {
    todoElement.classList.add('due');
  }

  appendElements(todoElement, todoElementContent, todoActions);
  return todoElement;
}

function displayTodos(todosArray) {
  todosArray.forEach((todo) => {
    todosDisplay.appendChild(createTodo(todo));
  });
}

function displayProjectTitle(project) {
  const title = createElement('h2', ['project-header'], project.title);
  todosDisplay.appendChild(title);
}

function handleEmptyProject(project) {
  const emptyProjectElement = createElement('div', ['empty-project'], 'This project is empty');
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
    let todosArray = [];
    let currentProject = todoList.getTodoProjectByTitle(projectName);

    if (projectName === 'Home') {
      todosArray = todoList.allTodos;
    } else {
      if (currentProject.isAddingRestricted) {
        hideElement(openAddDialog);
      }

      if (!currentProject.isEmpty()) {
        todosArray = [...todosArray, ...currentProject.todos];
      }
    }

    displayProjectTitle(currentProject);

    if (todosArray.length !== 0) {
      displayTodos(todosArray);
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
  const buttonContent = createElement('span', ['button-content']);
  const buttonText = createElement('span', ['button-text'], todoProject.title);
  const todosCount = createElement('span', ['todos-count'], todoProject.unfinishedTodos.length);

  if (todoProject.title === 'Home') {
    todosCount.innerText = projectsList.allUnfinishedTodos.length;
  }

  if (+todosCount.innerText === 0) {
    todosCount.innerText = '';
  }

  buttonContent.appendChild(buttonText);
  buttonContent.appendChild(todosCount);

  const button = createElement('button', ['project-button']);
  appendElements(button, buttonContent);
  button.setAttribute('data-project-name', todoProject.title);
  button.setAttribute('data-list-name', todoProject.parentList);

  listItem.appendChild(button);

  if (todoProject.deletable) {
    const buttonDelete = createElement('span', ['delete-project']);
    buttonDelete.innerHTML = '<span class="material-symbols-outlined icon"> close </span>';
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
  clear();
  showElement(openAddDialog);
  displayProjectButtons(projectsList);
  displayProjectTodos(projectsList, currentProjectName);
  setActiveButton();
}

document.addEventListener('DOMContentLoaded', () => {
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
