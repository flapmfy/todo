import { updateInterface } from './main';
import { Todo, TodoProject, TodoList } from './model';

let currentProjectName = 'Home';
const currentDate = new Date();

//////////////////////////////////////////////////////////////////////////////////
let projectsList = new TodoList();

let home = new TodoProject('Home', false);
let today = new TodoProject('Today', false, true);
let week = new TodoProject('Week', false, true);
projectsList.addTodoProject(home);
projectsList.addTodoProject(today);
projectsList.addTodoProject(week);

/////////////////////////////////////////handlers/////////////////////////////////////////
function handleTodoCheck(e) {
  const checkBox = e.currentTarget;
  const todoElement = checkBox.closest('.todo');
  changeTodoStatus(todoElement);

  updateList();
  updateInterface();
}

function changeTodoStatus(todoElement) {
  const projectObj = projectsList.getTodoProjectByTitle(todoElement.getAttribute('data-project'));
  const todoId = todoElement.getAttribute('data-todoid');
  const todoObj = projectObj.getTodo(todoId);

  todoObj.finished = !todoObj.finished;
}

function handleProjectSwitch(e) {
  currentProjectName = e.currentTarget.getAttribute('data-project-name');
  updateInterface();
}

function removeProject(projectName) {
  if (projectName === currentProjectName) {
    currentProjectName = 'Home';
  }

  projectsList.removeTodoProjectByName(projectName);
  updateList();
  updateInterface();
}

function handleProjectAdd(projectName) {
  if (projectName) {
    projectsList.addTodoProject(new TodoProject(projectName));
    currentProjectName = projectName;
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
    if (todo.dueDate) {
      let timeDiff = todo.dueDate - currentDate;
      return timeDiff > 0 && timeDiff < daysInMiliseconds;
    }
    return false;
  };
}

let hasDayLeft = dueInNumberOfDays(1);
let hasWeekLeft = dueInNumberOfDays(7);

function updateList() {
  today.todos = projectsList.allTodos.filter(hasDayLeft);
  week.todos = projectsList.allTodos.filter(hasWeekLeft);

  saveList();
}

function saveList() {
  const listJson = JSON.stringify(projectsList.toPlainObject());
  localStorage.setItem('todosList', listJson);
}

function loadList() {
  if (localStorage.getItem('todosList')) {
    let storedList = JSON.parse(localStorage.getItem('todosList'));
    projectsList = TodoList.fromPlainObject(storedList);
    home = projectsList.getTodoProjectByTitle('Home');
    today = projectsList.getTodoProjectByTitle('Today');
    week = projectsList.getTodoProjectByTitle('Week');
  }
}

loadList();
export { handleProjectSwitch, currentProjectName, handleProjectAdd, projectsList, handleTodoAdd, hasDayLeft, hasWeekLeft, updateList, removeProject, handleTodoCheck, currentDate };
