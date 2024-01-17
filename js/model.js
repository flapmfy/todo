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

///////////////////////////project///////////////////////////

class TodoProject {
  constructor(title, deletable = true) {
    this._title = title;
    this._deletable = deletable;
    this._todos = [];
    this._parentList;
  }

  addTodo(todo) {
    todo.parentTitle = this._title;
    this._todos.push(todo);
  }

  removeTodo(todoId) {
    this._todos.splice(todoId, 1);
  }

  get parentList() {
    return this._parentList;
  }

  set parentList(parentName) {
    this._parentList = parentName;
  }

  get deletable() {
    return this._deletable;
  }

  get todos() {
    return this._todos;
  }

  set todos(todosArray) {
    this._todos = todosArray;
  }

  get title() {
    return this._title;
  }

  getTodo(todoId) {
    return this._todos[todoId];
  }

  isEmpty() {
    return this._todos.length === 0;
  }
}

///////////////////////////projects list///////////////////////////

class TodoList {
  constructor(title) {
    this._title = title;
    this._todoProjects = [];
  }

  addTodoProject(todoProject) {
    if (this.getTodoProjectByTitle(todoProject.title)) return;
    todoProject.parentList = this._title;
    this._todoProjects.push(todoProject);
  }

  removeTodoProject(todoProjectId) {
    this._todoProjects.splice(todoProjectId, 1);
  }

  removeTodoProjectByName(todoProjectName) {
    for (let i = 0; i < this._todoProjects.length; i++) {
      if (this._todoProjects[i].title === todoProjectName) {
        this.removeTodoProject(i);
        break;
      }
    }
  }

  get todoProjects() {
    return this._todoProjects;
  }

  getTodoProjectById(todoProjectId) {
    return this._todoProjects[todoProjectId];
  }

  getTodoProjectByTitle(todoProjectTitle) {
    if (todoProjectTitle && this.projectExists(todoProjectTitle)) {
      let foundProject;

      for (let project of this._todoProjects) {
        if (project.title === todoProjectTitle) {
          foundProject = project;
          break;
        }
      }

      return foundProject;
    }
    return;
  }

  projectExists(todoProjectTitle) {
    for (let project of this._todoProjects) {
      if (project.title === todoProjectTitle) {
        return true;
      }
    }
    return false;
  }

  get allTodos() {
    let todos = [];

    this._todoProjects.forEach((todoProject) => {
      todos = [...todos, ...todoProject.todos];
    });

    return todos;
  }

  get title() {
    return this._title;
  }

  set title(newTitle) {
    this._title = newTitle;
  }
}

export { Todo, TodoProject, TodoList };
