import { Todo } from '../types';
import { client } from '../utils';

export const USER_ID = 1554;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({
  title,
  userId,
  completed,
}: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post('/todos', { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (data: Todo): Promise<Todo> => {
  const { id } = data;

  return client.patch(`/todos/${id}`, data);
};
