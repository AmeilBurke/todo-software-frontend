import axios from "axios";
import { Todo, TodoPage } from "../../types/TypeIndex";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function GetAllTodoPages(
  todoPageId: number
): Promise<[TodoPage[], Todo[]] | string> {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/todo-pages/account/${todoPageId}`, {
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
