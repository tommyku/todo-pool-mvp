import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import { v4 as guid } from 'uuid';
import Todo from './todo.jsx';
import List from './list.jsx';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      todos: {
        todo: [],
        pool: []
      }
    }

    this.firebase = Firebase.initializeApp({
      apiKey: "",
      authDomain: "",
      databaseURL: "",
    });

    this.userId = localStorage.getItem('userId') || guid();
    this.ref = this.firebase.database().ref(`${this.userId}`);
    localStorage.setItem('userId', this.userId);

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillMount() {
    this.bindAsObject(this.ref, 'todos');
  }

  contextTodo() {
    let context = [].concat(this.state.todos.todo || [])
                    .concat(this.state.todos.pool || []);
    context = context.filter((todo)=> {
      return todo.status === 'context';
    });
    return context;
  }

  handleAdd(list, todo) {
    list = (list === 'context') ? 'todo' : list;
    let newTodos = this.state.todos;
    newTodos[list] = newTodos[list] || [];
    newTodos[list].unshift(todo);
    this.setState({
      todos: newTodos
    });
    this.ref.set({
      pool: this.state.todos.pool || [],
      todo: this.state.todos.todo || []
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
    this.ref.set({
      pool: this.state.todos.pool || [],
      todo: this.state.todos.todo || []
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
    this.ref.set({
      pool: this.state.todos.pool || [],
      todo: this.state.todos.todo || []
    });
  }

  render() {
    return (
      <div>
        <List type='context'
          primaryHeader='而家'
          todo={this.contextTodo()}
          handleRemove={this.handleRemove}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
        />
        <List type='todo'
          primaryHeader='遲d'
          todo={this.state.todos.todo || []}
          handleRemove={this.handleRemove}
          handleAdd={this.handleAdd}
          handleUpdate={this.handleUpdate}
        />
      </div>
    );
  }
}

reactMixin(App.prototype, ReactFireMixin);

export default App;
