import axios from "axios";
import { TodoPage } from "../../types/TypeIndex";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function apiRequestCreateNewTodoPage(
  accountId: number
): Promise<TodoPage> {
  return await axios
    .post(
      `${import.meta.env.VITE_API_URL}/todo-pages/${accountId}`,
      {},
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
