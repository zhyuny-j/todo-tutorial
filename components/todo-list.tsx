"use client";

import { useTodos } from "@/hooks/use-todos";
import { TodoInput } from "@/components/todo-input";
import { TodoItem } from "@/components/todo-item";

export function TodoList() {
  const { todos, loaded, addTodo, toggleTodo, deleteTodo, editTodo } =
    useTodos();

  return (
    <div className="flex flex-col gap-4">
      <TodoInput onAdd={addTodo} />

      {loaded && todos.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          아직 할 일이 없습니다. 위에 입력해 추가해보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
