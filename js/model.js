class Todo {
  constructor(title, description, dueDate, priority, finished, parentTitle = '', todoId = -1) {
    this._title = title;
    this._description = description;

    if (!dueDate) {
      this._dueDate = '';
    } else {
      this._dueDate = new Date(dueDate);
    }

    this._priority = priority;
    this._finished = finished;
    this._parentTitle = parentTitle;
    this._todoId = todoId;
  }

  get todoId() {
    return this._todoId;
  }

  set todoId(todoId) {
    this._todoId = todoId;
  }

  toPlainObject() {
    return {
      title: this._title,
      description: this._description,
      dueDate: this._dueDate,
      priority: this._priority,
      finished: this._finished,
      parentTitle: this._parentTitle,
      todoId: this._todoId
    };
  }

  static fromPlainObject(plainTodo) {
    return new Todo(plainTodo.title, plainTodo.description, plainTodo.dueDate, plainTodo.priority, plainTodo.finished, plainTodo.parentTitle, plainTodo.todoId);
  }

  isDue() {
    if (this._dueDate) {
      const date = new Date();
      const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return currentDate > this._dueDate;
    }
    return false;
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
}

///////////////////////////project///////////////////////////

class TodoProject {
  constructor(title, deletable = true, isAddingRestricted = false, todos = []) {
    this._title = title;
    this._deletable = deletable;
    this._isAddingRestricted = isAddingRestricted;
    this._todos = todos;
  }

  reorderTodos() {
    this._todos.forEach((todo, id) => {
      todo.todoId = id;
    });
  }

  toPlainObject() {
    return {
      title: this._title,
      deletable: this._deletable,
      isAddingRestricted: this._isAddingRestricted,
      todos: this.nestedObjectToPlain()
    };
  }

  nestedObjectToPlain() {
    return this._todos.map((todo) => {
      if (todo instanceof Todo) {
        return todo.toPlainObject();
      }
    });
  }

  static fromPlainObject(plainProject) {
    const todos = plainProject.todos.map((todo) => Todo.fromPlainObject(todo));
    return new TodoProject(plainProject.title, plainProject.deletable, plainProject.isAddingRestricted, todos);
  }

  addTodo(todo) {
    todo.parentTitle = this._title;
    this._todos.unshift(todo);
    this.reorderTodos();
  }

  removeTodo(todoId) {
    this._todos.splice(todoId, 1);
    this.reorderTodos();
  }

  get isAddingRestricted() {
    return this._isAddingRestricted;
  }

  get deletable() {
    return this._deletable;
  }

  get todos() {
    return this._todos;
  }

  get unfinishedTodos() {
    return this._todos.filter((todo) => !todo.finished);
  }

  getTodos() {
    if (this.isEmpty()) return;
    return this.todos;
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
  constructor(todoProjects = []) {
    this._todoProjects = todoProjects;
  }

  toPlainObject() {
    return {
      todoProjects: this.nestedObjectToPlain()
    };
  }

  nestedObjectToPlain() {
    return this._todoProjects.map((project) => {
      if (project instanceof TodoProject) {
        return project.toPlainObject();
      }
    });
  }

  static fromPlainObject(plainList) {
    const projects = plainList.todoProjects.map((todoProject) => TodoProject.fromPlainObject(todoProject));
    return new TodoList(projects);
  }

  addTodoProject(todoProject) {
    if (this.getTodoProjectByTitle(todoProject.title)) return;
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
      if (!todoProject.isEmpty() && !todoProject.isAddingRestricted) {
        todos = [...todos, ...todoProject.todos];
      }
    });

    return todos;
  }

  get allUnfinishedTodos() {
    return this.allTodos.filter((todo) => !todo.finished);
  }
}

export { Todo, TodoProject, TodoList };
