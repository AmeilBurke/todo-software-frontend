import { Input, VStack, HStack } from "@chakra-ui/react";
import { Todo, TodoPage } from "../../types/TypeIndex";
import { TfiCheckBox, TfiMenuAlt, TfiText } from "react-icons/tfi";
import { useState } from "react";
import apiRequestCreateNewTodo from "../../apiRequests/POST/apiRequestCreateNewTodo";

const ComponentAddNewItemInput = ({
  activeTodoPageInfo,
  activeTodoPageTodos,
  setActiveTodoPageTodos,
  // sortTodosForActivePageByDate
}: {
  activeTodoPageInfo: TodoPage | undefined,
  activeTodoPageTodos: Todo[] | undefined,
  setActiveTodoPageTodos: React.Dispatch<React.SetStateAction<Todo[] | undefined>>,
  // sortTodosForActivePageByDate: (todos: Todo[]) => void,
}) => {
  const [userInputText, setUserInputText] = useState<string>("");
  const [userInputListItem, setUserInputListItem] = useState<string>("");
  const [userInputTodoItem, setUserInputTodoItem] = useState<string>("");

  const createNewTodo = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    inputType: string
  ) => {
    if (event.key === "Enter") {
      let apiResponse: any;
      event.preventDefault();
      console.log("test");

      if (inputType === "text") {
        apiResponse = await apiRequestCreateNewTodo({
          todo_content: `t-${userInputText}`,
          todo_dateCreated: String(activeTodoPageInfo?.todoPage_createdDate),
          todoPage_id: Number(activeTodoPageInfo?.todoPage_id),
        });
      }

      if (inputType === "listItem") {
        apiResponse = await apiRequestCreateNewTodo({
          todo_content: `li-${userInputListItem}`,
          todo_dateCreated: String(activeTodoPageInfo?.todoPage_createdDate),
          todoPage_id: Number(activeTodoPageInfo?.todoPage_id),
        });
      }

      if (inputType === "todoItem") {
        apiResponse = await apiRequestCreateNewTodo({
          todo_content: `c-${userInputTodoItem}`,
          todo_dateCreated: String(activeTodoPageInfo?.todoPage_createdDate),
          todoPage_id: Number(activeTodoPageInfo?.todoPage_id),
        });
      }

      console.log(apiResponse);
      console.log(activeTodoPageTodos);

      if (typeof apiResponse !== "string" && activeTodoPageTodos !== undefined) {
        setActiveTodoPageTodos([...activeTodoPageTodos, apiResponse]);
        // sortTodosForActivePageByDate([...activeTodoPageTodos, apiResponse]);
        setUserInputText("");
        setUserInputListItem("");
        setUserInputTodoItem("");
      }
    }
  };

  return (
    <VStack>
      <HStack>
        <TfiText />
        <Input
          value={userInputText}
          onBlur={() => setUserInputText("")}
          onChange={(e) => { setUserInputText(e.target.value) }}
          onKeyDown={(event) => { createNewTodo(event, "text") }}
          variant="flushed"
          placeholder="text"
        />
      </HStack>

      <HStack>
        <TfiMenuAlt />
        <Input
          value={userInputListItem}
          onBlur={() => setUserInputListItem("")}
          onChange={(e) => { setUserInputListItem(e.target.value) }}
          onKeyDown={(event) => createNewTodo(event, "listItem")}
          variant="flushed"
          placeholder="list item"
        />
      </HStack>
      <HStack>
        <TfiCheckBox />
        <Input
          value={userInputTodoItem}
          onBlur={() => setUserInputTodoItem("")}
          onChange={(e) => { setUserInputTodoItem(e.target.value) }}
          onKeyDown={(event) => createNewTodo(event, "todoItem")}
          variant="flushed"
          placeholder="todo item"
        />
      </HStack>
    </VStack>
  );
};

export default ComponentAddNewItemInput;
