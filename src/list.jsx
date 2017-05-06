import React from 'react';
import Todo from './todo.jsx';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOffContext = this.handleOffContext.bind(this);
    this.handleAddToContext = this.handleAddToContext.bind(this);
  }

  todoListItem(props) {
    return (
      <li key={props.key}>
        <input type='checkbox'
          defaultValue={props.done}
          data-index={props.index}
          onChange={this.handleDone} />
        <input type='text'
          defaultValue={props.text}
          data-index={props.index}
          onKeyDown={this.handleChange} />
        <button type='button'
          data-uuid={props.uuid}
          onClick={this.handleRemove}>
          {'\u00D7'}
        </button>
        { this.props.type === 'context' &&
            <button type='button'
              data-index={props.index}
              onClick={this.handleOffContext}>
              {'\u2193'}
            </button>
        }
        { this.props.type !== 'context' && props.status !== 'context' &&
            <button type='button'
              data-index={props.index}
              onClick={this.handleAddToContext}>
              {'\u2191'}
            </button>
        }
      </li>
    );
  }

  handleAdd(e) {
    if (e.key === 'Enter' ) {
      let text = e.target.value;
      e.target.value = '';
      let status = (this.props.type === 'context') ? 'context' : null;
      let newTask = new Todo(text, false, status);
      this.props.handleAdd(this.props.type, newTask);
    }
  }

  handleRemove(e) {
    this.props.handleRemove(this.props.type, e.target.dataset.uuid);
  }

  handleDone(e) {
    let done = e.target.checked;
    let index = e.target.dataset.index;
    let updatedTodo = this.props.todo[index];
    updatedTodo.done = done;
    this.props.handleUpdate(this.props.type, updatedTodo);
  }

  handleOffContext(e) {
    let index = e.target.dataset.index;
    let updatedTodo = this.props.todo[index];
    updatedTodo.status = '';
    this.props.handleUpdate(this.props.type, updatedTodo);
  }

  handleAddToContext(e) {
    let index = e.target.dataset.index;
    let updatedTodo = this.props.todo[index];
    updatedTodo.status = 'context';
    this.props.handleUpdate(this.props.type, updatedTodo);
  }

  handleChange(e) {
    if (e.key === 'Enter') {
      let text = e.target.value;
      let index = e.target.dataset.index;
      let updatedTodo = this.props.todo[index];
      updatedTodo.text = text;
      this.props.handleUpdate(this.props.type, updatedTodo);
    }
  }

  render() {
    return (
      <div>
        <h2>{this.props.primaryHeader}</h2>
        <ul>
          <li>
            <input type='text'
              placeholder='做乜'
              onKeyDown={this.handleAdd}
            />
          </li>
          {this.props.todo.map((todo, index)=> {
            return this.todoListItem({
              key: todo.uuid,
              uuid: todo.uuid,
              done: todo.done,
              status: todo.status,
              text: todo.text,
              index: index,
              type: this.props.type
            });
          })}
        </ul>
      </div>
    );
  }
}

export default List;
