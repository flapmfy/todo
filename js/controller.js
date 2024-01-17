import { updateInterface } from './main';
import { Todo, TodoProject, TodoList } from './model';

let currentProjectName = 'Home';
/////////////////////////////////////////will be deleted/////////////////////////////////////////
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

const projectsList = new TodoList();

const home = new TodoProject('Home', false);
const day = new TodoProject('Today', false);
const week = new TodoProject('Week', false);
projectsList.addTodoProject(home);
projectsList.addTodoProject(day);
projectsList.addTodoProject(week);
projectsList.addTodoProject(todoProject1);
projectsList.addTodoProject(todoProject2);
/////////////////////////////////////////will be deleted/////////////////////////////////////////

function handleProjectSwitch(e) {
  currentProjectName = e.currentTarget.getAttribute('data-project-name');
  updateInterface();
}

function removeProject(projectName) {
  projectsList.removeTodoProjectByName(projectName);
}

function handleProjectRemove(e) {
  e.stopPropagation();
  let projectNameToRemove = e.currentTarget.getAttribute('data-project-name');

  if (projectNameToRemove === currentProjectName) {
    currentProjectName = 'Home';
  }

  removeProject(projectNameToRemove);
  updateInterface();
}

function handleProjectAdd(projectName) {
  if (projectName) {
    projectsList.addTodoProject(new TodoProject(projectName));
    updateInterface();
  }
}

export { handleProjectSwitch, handleProjectRemove, currentProjectName, handleProjectAdd, projectsList };
