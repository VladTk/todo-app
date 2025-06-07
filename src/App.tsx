import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  getTodos,
  USER_ID,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import {
  Header,
  Footer,
  TodoList,
  Notification,
  UserWarning,
} from './components';
import { Todo, Filter } from './types';
import { filterTodos } from './utils';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isNotificationHidden, setIsNotificationHidden] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsNotificationHidden(false);

    setTimeout(() => {
      setErrorMessage('');
      setIsNotificationHidden(true);
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showErrorMessage('Unable to load todos'));
  }, []);

  const hasTodos = todos.length > 0;

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );
  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const areAllTodosCompleted = activeTodosCount === 0;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showErrorMessage('Title should not be empty');

      return Promise.reject('Title is empty');
    }

    const newTodoData = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...newTodoData, id: 0 });

    return addTodo(newTodoData)
      .then(newTodo => setTodos(prev => [...prev, newTodo]))
      .catch(() => {
        showErrorMessage('Unable to add a todo');
        throw new Error('Add failed');
      })
      .finally(() => setTempTodo(null));
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds([todoId]);

    return deleteTodo(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => {
        showErrorMessage('Unable to delete a todo');
        throw new Error('Delete failed');
      })
      .finally(() => {
        setLoadingTodoIds([]);
        inputRef.current?.focus();
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setLoadingTodoIds([updatedTodo.id]);

    return updateTodo(updatedTodo)
      .then(received => {
        setTodos(prev =>
          prev.map(todo => (todo.id === received.id ? received : todo)),
        );
      })
      .catch(() => {
        showErrorMessage('Unable to update a todo');
        throw new Error('Update failed');
      })
      .finally(() => setLoadingTodoIds([]));
  };

  const bulkUpdateTodos = async (
    todosToChange: Todo[],
    updater: (todo: Todo) => Promise<Todo>,
  ) => {
    const ids = todosToChange.map(t => t.id);

    setLoadingTodoIds(ids);

    try {
      for (const todo of todosToChange) {
        try {
          const updated = await updater(todo);

          setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
        } catch {
          showErrorMessage('Unable to update a todo');
        }
      }
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const bulkDeleteTodos = async (todosToDelete: Todo[]) => {
    const ids = todosToDelete.map(t => t.id);

    setLoadingTodoIds(ids);

    for (const id of ids) {
      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } catch {
        showErrorMessage('Unable to delete a todo');
        throw new Error('Bulk delete failed');
      }
    }

    setLoadingTodoIds([]);
    inputRef.current?.focus();
  };

  const handleClearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    bulkDeleteTodos(completedTodos);
  };

  const handleToggleAllTodoSattus = () => {
    const todosToChange = areAllTodosCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    bulkUpdateTodos(todosToChange, todo =>
      updateTodo({ ...todo, completed: !todo.completed }),
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todo-app">
      <h1 className="todo-app__title">todos</h1>

      <div className="todo-app__content">
        <Header
          areAllTodosCompleted={areAllTodosCompleted}
          onAdd={handleAddTodo}
          inputRef={inputRef}
          hasTodos={hasTodos}
          onToggleAll={handleToggleAllTodoSattus}
        />

        {(hasTodos || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />
        )}

        {hasTodos && (
          <Footer
            currFilter={filter}
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            onFilterClick={setFilter}
            onClearCompletedTodos={handleClearCompletedTodos}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        isHidden={isNotificationHidden}
        onClose={setIsNotificationHidden}
      />
    </div>
  );
};
