import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoInput } from "@/components/todo-input";

describe("TodoInput 우선순위 선택", () => {
  it("기본 우선순위는 '보통'이 선택되어 있다", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "보통" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "높음" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("우선순위를 클릭하면 선택 상태가 바뀐다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "높음" }));

    expect(screen.getByRole("radio", { name: "높음" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "보통" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("Enter로 제출하면 입력값과 선택한 우선순위로 onAdd를 호출한다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByRole("radio", { name: "낮음" }));
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "장보기{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "장보기",
      "low",
      undefined,
      undefined
    );
  });

  it("제출 후 우선순위가 기본값('보통')으로 초기화된다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "높음" }));
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "장보기{Enter}"
    );

    expect(screen.getByRole("radio", { name: "보통" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});

describe("TodoInput 마감일", () => {
  it("마감일을 입력하면 onAdd에 마감일이 함께 전달된다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("마감일"), {
      target: { value: "2026-07-01" },
    });
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "회의{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "회의",
      "medium",
      "2026-07-01",
      undefined
    );
  });

  it("마감일을 비워두면 마감일 없이 onAdd를 호출한다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "회의{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "회의",
      "medium",
      undefined,
      undefined
    );
  });

  it("제출 후 마감일 입력이 초기화된다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    const dueInput = screen.getByLabelText("마감일") as HTMLInputElement;
    fireEvent.change(dueInput, { target: { value: "2026-07-01" } });
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "회의{Enter}"
    );

    expect(dueInput.value).toBe("");
  });
});

describe("TodoInput 카테고리 선택", () => {
  it("기본 카테고리는 '없음'이 선택되어 있다", () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "없음" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("카테고리(업무) 선택 후 추가 → onAdd에 카테고리가 전달된다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.click(screen.getByRole("radio", { name: "업무" }));
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "보고서{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "보고서",
      "medium",
      undefined,
      "work"
    );
  });

  it("카테고리 미선택 시 category 없이 onAdd를 호출한다", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "청소{Enter}"
    );

    expect(onAdd).toHaveBeenCalledExactlyOnceWith(
      "청소",
      "medium",
      undefined,
      undefined
    );
  });

  it("제출 후 카테고리가 '없음'으로 초기화된다", async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    await user.click(screen.getByRole("radio", { name: "업무" }));
    await user.type(
      screen.getByRole("textbox", { name: "새 할 일" }),
      "보고서{Enter}"
    );

    expect(screen.getByRole("radio", { name: "없음" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});
