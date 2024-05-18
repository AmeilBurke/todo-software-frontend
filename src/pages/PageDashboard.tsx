import { useEffect, useState } from "react"
import { Account, Todo, TodoPage } from "../types/TypeIndex"
import { HStack, VStack, Text, Button, Select, Box } from "@chakra-ui/react"
import GetAllTodosForAPage from "../apiRequests/GET/GetAllTodosForAPage"
import '../index.css';
import apiRequestCreateNewTodoPage from "../apiRequests/POST/apiRequestCreateNewTodoPage"
import GetAllTodoPages from "../apiRequests/GET/GetAllTodoPages"
import ComponentTodoPageContent from "../components/ComponentsPageDashboard/ComponentTodoPageContent"
import ComponentAddNewItemInput from "../components/ComponentsPageDashboard/ComponentAddNewItemInput"
import ComponentSettingsMenu from "../components/ComponentsPageDashboard/ComponentSettingsMenu";
import apiRequestDeleteIndividualTodoPage from "../apiRequests/DELETE/apiRequestDeleteIndividualTodoPage";

const PageDashboard = ({ accountInfo }: { accountInfo: Account }) => {
  const [allPagesArray, setAllPagesArray] = useState<TodoPage[]>([]);
  const [allPagesTodoArray, setAllPagesTodoArray] = useState<Todo[]>([]);
  const [activePageId, setActivePageId] = useState<number>(-1);
  const [activePageInfo, setActivePageInfo] = useState<TodoPage | undefined>(undefined);
  const [activePageTodoArray, setActivePageTodoArray] = useState<Todo[]>([]);

  // re-write this to make it cleaner & clearer, try to remove some of the usestates

  const getTodoArrayForActivePage = async (pageId: number) => {
    if (typeof accountInfo !== "undefined") {
      const todoArray = await GetAllTodosForAPage(pageId);
      // console.log(todoArray);

      if (typeof todoArray !== 'string') {
        setActivePageTodoArray(todoArray);
      }
    }
  }

  const getAllTodoPages = async () => {
    const apiResponse = await GetAllTodoPages(accountInfo.account_id);
    // console.log(apiResponse);

    if (typeof apiResponse !== 'string') {
      setAllPagesArray(apiResponse[0]);
      setAllPagesTodoArray(apiResponse[1]);
    }
  }

  const setDefaultActivePage = async () => {
    setActivePageId(allPagesArray[0].todoPage_id);
    const apiResponse = await GetAllTodosForAPage(allPagesArray[0].todoPage_id);
    if (typeof apiResponse != 'string') {
      // console.log(apiResponse);
      setActivePageTodoArray(apiResponse);
    }
  }

  const getActivePageInfo = () => {
    const activeTodoPageInfo = allPagesArray.filter((todoPage: TodoPage) => {
      if (todoPage.todoPage_id === activePageId) {
        return todoPage;
      }
    });
    setActivePageInfo(activeTodoPageInfo[0]);
    // console.log(activeTodoPageInfo);
  }

  const createNewTodoPage = async () => {
    const newTodo = await apiRequestCreateNewTodoPage(accountInfo.account_id);

    if (typeof newTodo !== 'string') {
      setActivePageId(newTodo.todoPage_id);
      getActivePageInfo();
      await getAllTodoPages();
      await getTodoArrayForActivePage(newTodo.todoPage_id);
    }
  }

  const deleteTodoPage = async () => {
    const test = await apiRequestDeleteIndividualTodoPage(activePageId);
    console.log(test);

    if (typeof test !== 'string') {
      await setDefaultActivePage();
      await getAllTodoPages();
    }

  }

  // when creating a new page, and trying to delete it, it is not included in the allPagesArray

  const changeActivePage = async (pageId: number) => {

    if (pageId !== activePageId) {
      setActivePageId(pageId);
      getTodoArrayForActivePage(pageId);
      getActivePageInfo();
    }
  }

  useEffect(() => {

    if (allPagesArray.length === 0) {
      getAllTodoPages();
    }

    if (allPagesArray.length !== 0 && activePageId === -1) {
      setDefaultActivePage();
    }

    getActivePageInfo();

  }, [allPagesArray, activePageId, activePageInfo, activePageTodoArray]);

  return (
    <HStack justifyContent="space-evenly" spacing="0">
      <VStack>
        <VStack justifyContent="space-between">
          {
            allPagesArray.map((todoPage) => {
              return <Button key={todoPage.todoPage_id} onClick={() => { changeActivePage(todoPage.todoPage_id) }}>{todoPage.todoPage_heading}</Button>
            })
          }
          <Button onClick={createNewTodoPage}>Create new page</Button>
          <ComponentSettingsMenu deleteTodoPage={deleteTodoPage} />
        </VStack>
      </VStack>
      <VStack>
        <HStack></HStack>
        <VStack alignItems="flex-start">

          {
            activePageInfo !== undefined
              ? <Text>{activePageInfo.todoPage_heading}</Text>
              : <></>
          }

          {
            activePageTodoArray.map((todo: Todo) => {
              return <ComponentTodoPageContent key={todo.todo_id} todo={todo} activePageTodoArray={activePageTodoArray} setActivePageTodoArray={setActivePageTodoArray} />
            })
          }
          {/* <ComponentAddNewItemInput activePageTodoArray={activePageTodoArray} setActivePageTodoArray={setActivePageTodoArray} activePageId={activePageId} getTodoArrayForAPage={getTodoArrayForAPage} /> */}
        </VStack>
      </VStack>
    </HStack >
  )
}

export default PageDashboard
