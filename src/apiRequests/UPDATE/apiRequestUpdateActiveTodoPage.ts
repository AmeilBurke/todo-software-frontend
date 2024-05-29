import axios from "axios";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";
import { TodoPage } from "../../types/TypeIndex";

export default async function apiRequestUpdateActiveTodoPage(
  todoPageContent: TodoPage
): Promise<TodoPage | string> {
  return await axios
    .patch(
      `${import.meta.env.VITE_API_URL}/todo-pages/${
        todoPageContent.todoPage_id
      }`,
      {
        todoPageHeading: todoPageContent.todoPage_heading,
        todoPageDescription: todoPageContent.todoPage_description,
        todoPageIsPageArchived: todoPageContent.todoPage_isPageArchived,
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
