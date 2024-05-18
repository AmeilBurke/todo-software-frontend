import axios from "axios";
import { Todo } from "../../types/TypeIndex";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function apiRequestDeleteIndividualTodoPage(
  todoPageId: number
): Promise<Todo | string> {
  return await axios
    .delete(`${import.meta.env.VITE_API_URL}/todo-pages/${todoPageId}`, {
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
