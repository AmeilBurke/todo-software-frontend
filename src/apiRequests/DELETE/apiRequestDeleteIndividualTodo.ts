import axios from "axios";
import { Todo } from "../../types/TypeIndex";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function apiRequestDeleteIndividualTodo(
  todoId: number
): Promise<Todo | string> {
  return await axios
    .delete(`${import.meta.env.VITE_API_URL}/todos/${todoId}`, {
      headers: {
        Authorization: `Bearer ${CheckLocalStorageForJWT()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return String(error);
    });
}
