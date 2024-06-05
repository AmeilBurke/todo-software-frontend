import axios from "axios";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";
import { Todo } from "../../types/TypeIndex";

export default async function apiRequestUpdateActiveTodoList({
  todoId,
  todoContent,
  todoIsCompleted,
}: {
  todoId: number;
  todoContent: string;
  todoIsCompleted?: boolean;
}): Promise<Todo | string> {
  return await axios
    .patch(
      `${import.meta.env.VITE_API_URL}/todos/${todoId}`,
      {
        todoContent: todoContent,
        todoIsCompleted: todoIsCompleted === undefined ? false : todoIsCompleted,
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
