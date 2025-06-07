import React, { useEffect } from 'react';
import classNames from 'classnames';

type Props = {
  areAllTodosCompleted: boolean;
  onAdd: (title: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  hasTodos: boolean;
  onToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  areAllTodosCompleted,
  onAdd,
  inputRef,
  hasTodos,
  onToggleAll,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.disabled = true;

    onAdd(input.value)
      .then(() => {
        input.value = '';
      })
      .finally(() => {
        input.disabled = false;
        input.focus();
      });
  };

  return (
    <header className="todo-app__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todo-app__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todo-app__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
