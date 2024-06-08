export type Account = {
  account_email: string;
  account_id: number;
  account_password: string;
  account_role: number;
  account_username: string;
};

export type Todo = {
  todo_id?: number;
  todo_content: string;
  todo_isCompleted?: boolean;
  todo_dateCompleted?: string;
  todo_completedBy?: number;
  todo_dateCreated: string;
  todoPage_id: number;
};

export type TodoPage = {
  todoPage_heading: string;
  todoPage_description?: string;
  todoPage_createdDate?: string;
  todoPage_isPageArchived: boolean;
  todoPage_createdBy: number;
  todoPage_id: number;
};
