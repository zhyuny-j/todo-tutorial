"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onAdd(value);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="할 일을 입력하고 Enter를 누르세요"
        aria-label="새 할 일"
      />
    </form>
  );
}
