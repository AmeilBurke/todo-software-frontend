import axios from "axios";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";
import { Todo } from "../../types/TypeIndex";

export default async function apiRequestUpdateActiveTodoList({
  todoId,
  todoContent,
}: {
  todoId: number;
  todoContent: string;
}): Promise<Todo | string> {
  return await axios
    .patch(
      `${import.meta.env.VITE_API_URL}/todos/${todoId}`,
      {
        todoContent: todoContent,
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
