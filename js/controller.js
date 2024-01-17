import { updateInterface } from './main';
import { Todo, TodoProject, TodoList } from './model';

let currentProjectName = 'Home';
let currentListName = 'overviewList';
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

const projectsList = new TodoList('projectsList');
projectsList.addTodoProject(todoProject1);
projectsList.addTodoProject(todoProject2);

const overviewList = new TodoList('overviewList');
const home = new TodoProject('Home', false);
const day = new TodoProject('Day', false);
const week = new TodoProject('Week', false);
overviewList.addTodoProject(home);
overviewList.addTodoProject(day);
overviewList.addTodoProject(week);

const lists = {
  projectsList,
  overviewList,
};
/////////////////////////////////////////will be deleted/////////////////////////////////////////

function removeProject(projectName) {
  projectsList.removeTodoProjectByName(projectName);
}

function handleProjectSwitch(e) {
  currentProjectName = e.currentTarget.getAttribute('data-project-name');
  currentListName = e.currentTarget.getAttribute('data-list-name');
  update();
}

function handleProjectRemove(e) {
  e.stopPropagation();
  let projectNameToRemove = e.currentTarget.getAttribute('data-project-name');

  if (projectNameToRemove === currentProjectName) {
    currentProjectName = 'Práce';
  }

  removeProject(projectNameToRemove);
  update();
}

function handleProjectAdd(projectName) {
  if (projectName) {
    projectsList.addTodoProject(new TodoProject(projectName));
    update();
  }
}

function updateOverviewProjects() {
  home.todos = lists.projectsList.allTodos;
}

function update() {
  updateOverviewProjects();
  updateInterface();
}

export { handleProjectSwitch, handleProjectRemove, currentProjectName, handleProjectAdd, lists, currentListName, update };
