import React from 'react';
import classNames from 'classnames';

import { Filter } from '../../types';

type Props = {
  currFilter: Filter;
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  onFilterClick: (newFilter: Filter) => void;
  onClearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  currFilter,
  activeTodosCount,
  hasCompletedTodos,
  onFilterClick,
  onClearCompletedTodos,
}) => {
  const renderFilterLink = (filter: Filter) => {
    const label =
      filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase();
    const href = `#/${filter === Filter.All ? '' : filter.toLowerCase()}`;
    const isSelected = currFilter === filter;

    return (
      <a
        key={filter}
        href={href}
        className={classNames('filter__link', { selected: isSelected })}
        data-cy={`FilterLink${label}`}
        onClick={() => onFilterClick(filter)}
      >
        {label}
      </a>
    );
  };

  return (
    <footer className="todo-app__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(renderFilterLink)}
      </nav>

      <button
        type="button"
        className="todo-app__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompletedTodos}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
