import '/style.css';
import { handleProjectSwitch, currentProjectName, handleProjectAdd, projectsList, handleTodoAdd, removeProject, handleTodoCheck, handleTodoDelete } from './controller';

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

const detailsDialog = appElement.querySelector('#details-dialog');

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

function hideElement(element) {
  element.style.display = 'none';
}

function showElement(element) {
  element.style.display = 'block';
}

function formatedDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let dayOfWeek = '';

  switch (date.getDay()) {
    case 0:
      dayOfWeek = 'Sun';
      break;

    case 1:
      dayOfWeek = 'Mon';
      break;

    case 2:
      dayOfWeek = 'Tue';
      break;

    case 3:
      dayOfWeek = 'Wed';
      break;

    case 4:
      dayOfWeek = 'Thr';
      break;

    case 5:
      dayOfWeek = 'Fri';
      break;

    case 6:
      dayOfWeek = 'Sat';
      break;
  }

  return `${dayOfWeek} ${day}. ${month}.`;
}

/////////////////////////////////////////todos/////////////////////////////////////////
function createTodo(todoObj) {
  const todoElement = createElement('div', ['todo', 'flex-repel']);
  const todoElementContent = createElement('div', ['todo__content']);
  const todoActions = createElement('div', ['todo-actions', 'flex-group']);
  todoElement.setAttribute('data-priority', todoObj.priority);

  const checkBox = createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.addEventListener('click', () => handleTodoCheck(todoObj));
  todoElementContent.appendChild(checkBox);

  const todoInfo = createElement('div', ['todo__info']);
  const todoDetails = createElement('div', ['todo-details']);
  if (!projectsList.getTodoProjectByTitle(currentProjectName).deletable) {
    const parentProject = createElement('span', ['todo-parent'], `${todoObj.parentTitle}, `);
    todoDetails.appendChild(parentProject);
  }
  const todoDueDate = createElement('span', ['todo-duedate'], formatedDate(todoObj.dueDate));
  const todoTitle = createElement('div', ['todo-title'], `${todoObj.title}`);
  todoDetails.appendChild(todoDueDate);

  appendElements(todoInfo, todoTitle, todoDetails);
  appendElements(todoElementContent, todoInfo);

  const detailsButton = createElement('button', ['icon-button']);
  detailsButton.innerHTML = '<span class="material-symbols-outlined icon">info</span>';
  detailsButton.addEventListener('click', () => showDetailsDialog(todoObj));
  todoActions.appendChild(detailsButton);

  const deleteButton = createElement('button', ['icon-button']);
  deleteButton.innerHTML = '<span class="material-symbols-outlined icon">delete</span>';
  deleteButton.addEventListener('click', () => handleTodoDelete(todoObj.parentTitle, todoObj.todoId));
  todoActions.appendChild(deleteButton);

  if (todoObj.finished) {
    checkBox.setAttribute('checked', true);
  }

  if (todoObj.isDue() && !todoObj.finished) {
    todoDetails.classList.add('due');
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
  const emptyProjectElement = createElement('div', ['empty-project']);
  emptyProjectElement.innerHTML = '<p>This project is empty</p>';
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
    emptyProjectElement.innerHTML = '<p>No reason to stress</p>';
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

function handleProjectRemove(e, removingProjectName) {
  e.stopPropagation();

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
    todosCount.style.display = 'none';
  } else if (+todosCount.innerText > 9) {
    todosCount.innerText = '+9';
  }

  buttonContent.appendChild(buttonText);
  buttonContent.appendChild(todosCount);

  const button = createElement('button', ['project-button']);
  appendElements(button, buttonContent);
  button.setAttribute('data-project-name', todoProject.title);

  listItem.appendChild(button);

  if (todoProject.deletable) {
    const buttonDelete = createElement('span', ['delete-project']);
    buttonDelete.innerHTML = '<span class="material-symbols-outlined icon"> close </span>';
    buttonDelete.setAttribute('data-project-name', todoProject.title);
    buttonDelete.addEventListener('click', (e) => handleProjectRemove(e, todoProject.title));
    button.appendChild(buttonDelete);
  }

  button.addEventListener('click', () => handleProjectSwitch(todoProject.title));

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

function showDetailsDialog(todoObj) {
  detailsDialog.querySelector('.dialog-header').innerText = `Todo: ${todoObj.title}`;
  const dialogBody = detailsDialog.querySelector('.dialog-body');
  dialogBody.innerHTML = '';

  const descriptionSection = createElement('div');
  const descriptionTitle = createElement('h3', [], 'Description:');
  const description = createElement('p', [], todoObj.description);
  appendElements(descriptionSection, descriptionTitle, description);
  if (todoObj.description) {
    dialogBody.appendChild(descriptionSection);
  }

  const parentTitleSection = createElement('div');
  const parentTitleTitle = createElement('h3', [], 'Project:');
  const parentTitle = createElement('p', [], todoObj.parentTitle);
  appendElements(parentTitleSection, parentTitleTitle, parentTitle);
  dialogBody.appendChild(parentTitleSection);

  const dueDateSection = createElement('div');
  const dueDateTitle = createElement('h3', [], 'Due date:');
  const dueDate = createElement('p', [], todoObj.dueDate);
  appendElements(dueDateSection, dueDateTitle, dueDate);
  if (todoObj.dueDate) {
    dialogBody.appendChild(dueDateSection);
  }

  detailsDialog.showModal();
}

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
  let newTodoDuedate = todoDuedateInput.value;
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
