import axios from "axios";
import { TodoPage } from "../../types/TypeIndex";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function GetAllTodoPages(
  accountId: number
): Promise<TodoPage[] | string> {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/todo-pages/account/${accountId}`, {
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
