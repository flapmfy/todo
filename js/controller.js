import { updateInterface } from './main';
import { Todo, TodoProject, TodoList } from './model';

let currentProjectName = 'Home';
const currentDate = new Date();
/////////////////////////////////////////will be deleted/////////////////////////////////////////
let todo1 = new Todo('Zítra', 'Toto je pouze test', new Date('January 19, 2024 03:24:00'), 1, false);
let todo2 = new Todo('V týdnu', 'Toto je pouze test', new Date('January 23, 2024 03:24:00'), 1, false);
let todo3 = new Todo('Dnes', 'Toto je pouze test', new Date('January 18, 2024 03:24:00'), 1, false);
let todo4 = new Todo('Déle jak týden', 'Toto je pouze test', new Date('January 30, 2024 03:24:00'), 1, false);

const todoProject1 = new TodoProject('Škola');
todoProject1.addTodo(todo1);
todoProject1.addTodo(todo2);

const todoProject2 = new TodoProject('Práce');
todoProject2.addTodo(todo3);
todoProject2.addTodo(todo4);

const projectsList = new TodoList();

const home = new TodoProject('Home', false);
const today = new TodoProject('Today', false, true);
const week = new TodoProject('Week', false, true);
projectsList.addTodoProject(home);
projectsList.addTodoProject(today);
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
  updateList();
  updateInterface();
}

function handleProjectAdd(projectName) {
  if (projectName) {
    projectsList.addTodoProject(new TodoProject(projectName));
    updateList();
    updateInterface();
  }
}

function handleTodoAdd(title, details, duedate, priority) {
  projectsList.getTodoProjectByTitle(currentProjectName).addTodo(new Todo(title, details, duedate, priority));
  updateList();
  updateInterface();
}

function dueInNumberOfDays(days) {
  let daysInMiliseconds = days * 24 * 60 * 60 * 1000;

  return function (todo) {
    let timeDiff = todo.dueDate - currentDate;
    return timeDiff > 0 && timeDiff < daysInMiliseconds;
  };
}

let hasDayLeft = dueInNumberOfDays(1);
let hasWeekLeft = dueInNumberOfDays(7);

function updateList() {
  today.todos = projectsList.allTodosAsArray.filter(hasDayLeft);
  week.todos = projectsList.allTodosAsArray.filter(hasWeekLeft);
}

export { handleProjectSwitch, handleProjectRemove, currentProjectName, handleProjectAdd, projectsList, handleTodoAdd, hasDayLeft, hasWeekLeft, updateList };
