import { update } from './main';
import { Todo, TodoProject, TodoList } from './model';

let currentProjectName = '';
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

const list = new TodoList();
list.addTodoProject(todoProject1);
list.addTodoProject(todoProject2);
/////////////////////////////////////////will be deleted/////////////////////////////////////////

function removeProject(projectName) {
  list.removeTodoProjectByName(projectName);
}

function handleProjectSwitch(e) {
  currentProjectName = e.currentTarget.innerText;
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

export { handleProjectSwitch, handleProjectRemove, currentProjectName, list };
