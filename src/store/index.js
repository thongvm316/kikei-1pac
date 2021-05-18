import { createStore } from 'vuex'

const state = {
  todoList: []
};

const mutations = {
  createTodo(state, todo) {
    state.todoList.push({ id: todo.id, complete: todo.complete, title: todo.title, id: todo.id, complete: todo.complete, title: todo.title });
  },
  editTodo(state, todo) {
    const index = state.todoList.findIndex(
      item => item.id === todo.id
    );
    state.todoList[index] = todo;
  },
  removeTodo(state, id) {
    state.todoList = state.todoList.filter(
      item => item.id !== id
    );
  }
};

export const store = createStore({ state, mutations });
