import axios from "axios";
import { Todo } from "../../types/TypeIndex";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function apiRequestCreateNewTodo(
  todoContent: Todo
): Promise<Todo | string> {
  return await axios
    .post(
      `${import.meta.env.VITE_API_URL}/todos`,
      {
        todoContent: todoContent.todo_content,
        todoPageId: todoContent.todoPage_id,
      },
      {
        headers: {
          Authorization: `Bearer ${CheckLocalStorageForJWT()}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return String(error);
    });
}
