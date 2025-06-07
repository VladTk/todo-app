import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../../types';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDelete,
  onUpdate,
}) => {
  return (
    <section className="todo-app__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isLoading={loadingTodoIds.includes(todo.id)}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition timeout={300} classNames="item">
            <TodoItem todo={tempTodo} isLoading />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
