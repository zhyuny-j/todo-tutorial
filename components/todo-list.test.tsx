import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoList } from "@/components/todo-list";

// TodoList는 useTodos(localStorage)를 직접 사용하므로
// 입력 → 목록 → 영속화까지 전체 흐름을 통합으로 검증한다.

beforeEach(() => {
  localStorage.clear();
});

// 입력 필드에 텍스트를 입력하고 Enter로 제출하는 헬퍼
async function addTodo(user: ReturnType<typeof userEvent.setup>, text: string) {
  const input = screen.getByRole("textbox", { name: "새 할 일" });
  await user.type(input, `${text}{Enter}`);
}

describe("TodoList 검증 체크리스트", () => {
  it('1. 입력 필드에 "장보기" 입력 후 Enter → 목록에 추가됨', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await addTodo(user, "장보기");

    expect(await screen.findByText("장보기")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("2. 빈 입력 상태에서 Enter → Todo가 추가되지 않음", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    // 로드 완료 후 빈 상태 메시지가 나타나는지 먼저 확인
    expect(
      await screen.findByText(/아직 할 일이 없습니다/)
    ).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: "새 할 일" });
    await user.type(input, "{Enter}");

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.getByText(/아직 할 일이 없습니다/)).toBeInTheDocument();
  });

  it("3. 체크박스 클릭 → 완료 표시(취소선)", async () => {
    const user = userEvent.setup();
    render(<TodoList />);
    await addTodo(user, "장보기");
    await screen.findByText("장보기");

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByText("장보기")).toHaveClass("line-through");
  });

  it("4. 삭제 버튼 클릭 → 해당 항목 제거", async () => {
    const user = userEvent.setup();
    render(<TodoList />);
    await addTodo(user, "장보기");
    await screen.findByText("장보기");

    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(screen.queryByText("장보기")).not.toBeInTheDocument();
    expect(
      await screen.findByText(/아직 할 일이 없습니다/)
    ).toBeInTheDocument();
  });

  it("6. 우선순위(높음) 선택 후 추가 → 목록에 우선순위가 표시됨", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.click(screen.getByRole("radio", { name: "높음" }));
    await addTodo(user, "장보기");

    const item = await screen.findByRole("listitem");
    expect(item).toHaveTextContent("장보기");
    expect(item).toHaveTextContent("높음");
  });

  it("7. 우선순위 미선택 시 기본값(보통)으로 추가됨", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await addTodo(user, "장보기");

    const item = await screen.findByRole("listitem");
    expect(item).toHaveTextContent("보통");
  });

  it("5. 페이지 새로고침 → 기존 목록 유지", async () => {
    const user = userEvent.setup();

    // 첫 렌더에서 항목 추가 → localStorage에 저장됨
    const { unmount } = render(<TodoList />);
    await addTodo(user, "장보기");
    await screen.findByText("장보기");
    unmount();

    // 새로고침을 시뮬레이션: 새 인스턴스를 마운트하면 localStorage에서 다시 로드
    render(<TodoList />);

    expect(await screen.findByText("장보기")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
