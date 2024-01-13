class Todo {
  constructor(title, description, dueDate, priority, finished) {
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._priority = priority;
    this._finished = finished;
    this._dateCreated = new Date().getTime();
    this._parentTitle = '';
  }

  get title() {
    return this._title;
  }

  set title(newTitle) {
    this._title = newTitle;
  }

  get parentTitle() {
    return this._parentTitle;
  }

  set parentTitle(newParent) {
    this._parentTitle = newParent;
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
    todo.parentTitle = this._title;
    this._todos.unshift(todo);
  }

  removeTodo(todoId) {
    this._todos.splice(todoId, 1);
  }

  get todos() {
    return this._todos;
  }

  get title() {
    return this._title;
  }

  getTodo(todoId) {
    return this._todos[todoId];
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

  getTodoProjectById(todoProjectId) {
    return this._todoProjects[todoProjectId];
  }

  getTodoProjectByTitle(todoProjectTitle) {
    let foundProject;

    this._todoProjects.forEach((todoProject) => {
      if (todoProject.title === todoProjectTitle) {
        foundProject = todoProject;
      }
    });

    return foundProject;
  }

  get allTodos() {
    let todos = [];

    this._todoProjects.forEach((todoProject) => {
      todos = [...todos, ...todoProject.todos];
    });

    return todos;
  }
}

export { Todo, TodoProject, TodoList };
