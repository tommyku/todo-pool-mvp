import React from 'react';
import Todo from './todo.jsx'
import List from './list.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: {
        todo: [],
        pool: []
      }
    }

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  contextTodo() {
    let context = [].concat(this.state.todos.todo)
                    .concat(this.state.todos.pool);
    context = context.filter((todo)=> {
      return todo.status === 'context';
    });
    return context;
  }

  handleAdd(list, todo) {
    list = (list === 'context') ? 'todo' : list;
    let newTodos = this.state.todos;
    newTodos[list].unshift(todo);
    this.setState({
      todos: newTodos
    });
  }

  handleRemove(list, uuid) {
    list = (list === 'context') ? 'todo' : list;
    let newTodos = this.state.todos;
    newTodos[list] = newTodos[list].filter((todo)=> {
      return todo.uuid != uuid;
    });
    this.setState({
      todos: newTodos
    });
  }

  handleUpdate(list, update) {
    list = (list === 'context') ? 'todo' : list;
    let newTodos = this.state.todos;
    let updateIndex = newTodos[list].findIndex((todo)=> {
      return todo.uuid == update.uuid;
    });
    newTodos[list][updateIndex] = update;
    this.setState({
      todos: newTodos
    });
  }

  render() {
    return (
      <div>
        <List type='context'
          primaryHeader='Context'
          todo={this.contextTodo()}
          handleRemove={this.handleRemove}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
        />
        <List type='todo'
          primaryHeader='Todo'
          todo={this.state.todos.todo}
          handleRemove={this.handleRemove}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
        />
        <List type='pool'
          primaryHeader='The Pool'
          todo={this.state.todos.pool}
          handleRemove={this.handleRemove}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
        />
      </div>
    );
  }
}

export default App;
