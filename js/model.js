class Todo {
  constructor(title, description, dueDate, priority, finished) {
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
    this._finished = finished;
    this._dateCreated = new Date().getTime();
  }

  get title() {
    return this._title;
  }

  set title(newTitle) {
    this._title = newTitle;
  }

  get description() {
    return this._description;
  }

  set description(newDescription) {
    this._description = newDescription;
  }

  get dueDate() {
    return this._dueDate;
  }

  set dueDate(newDueDate) {
    this._dueDate = newDueDate;
  }

  get priority() {
    return this._priority;
  }

  set priority(newPriority) {
    this._priority = newPriority;
  }

  get finished() {
    return this._finished;
  }

  set finished(newFinished) {
    this._finished = newFinished;
  }

  get dateCreated() {
    return this._dateCreated;
  }
}

class TodoProject {
  constructor(title) {
    this._title = title;
    this._todos = [];
  }

  addTodo(todo) {
    this._todos.shift(todo);
  }

  removeTodo(todoId) {
    this._todos.splice(todoId, 1);
  }

  get todos() {
    return this._todos;
  }
}

class TodoList {
  constructor() {
    this._todoProjects = [];
  }

  addTodoProject(todoProject) {
    this._todoProjects.push(todoProject);
  }

  removeTodoProject(todoProjectId) {
    this._todoProjects.splice(todoProjectId, 1);
  }

  get todoProjects() {
    return this._todoProjects;
  }
}

export { Todo, TodoProject, TodoList };
