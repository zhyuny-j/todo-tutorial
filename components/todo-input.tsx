"use client";

import { useState } from "react";
import { DEFAULT_PRIORITY, PRIORITIES, type Priority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoInputProps {
  onAdd: (text: string, priority: Priority) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>(DEFAULT_PRIORITY);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onAdd(value, priority);
    setValue("");
    setPriority(DEFAULT_PRIORITY);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="할 일을 입력하고 Enter를 누르세요"
        aria-label="새 할 일"
      />

      <div role="radiogroup" aria-label="우선순위" className="flex gap-1">
        {PRIORITIES.map((item) => {
          const selected = item.value === priority;
          return (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={selected ? "default" : "outline"}
              role="radio"
              aria-checked={selected}
              onClick={() => setPriority(item.value)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </form>
  );
}
