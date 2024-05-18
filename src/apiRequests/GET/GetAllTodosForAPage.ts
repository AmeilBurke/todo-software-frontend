import axios from "axios";
import { Todo } from "../../types/TypeIndex";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function GetAllTodosForAPage(
  todoPageId: number
): Promise<Todo[] | string> {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/todos/find-all/${todoPageId}`, {
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
