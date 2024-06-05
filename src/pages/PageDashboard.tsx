import { useEffect, useState, } from "react"
import { Account, Todo, TodoPage, } from "../types/TypeIndex"
import { HStack, VStack, Button } from "@chakra-ui/react"
import '../index.css';
import GetAllTodoPages from "../apiRequests/GET/GetAllTodoPages";
import GetAllTodosForAPage from "../apiRequests/GET/GetAllTodosForAPage";
import apiRequestCreateNewTodoPage from "../apiRequests/POST/apiRequestCreateNewTodoPage";
import ComponentActivePageInfo from "../components/ComponentsPageDashboard/ComponentActivePageInfo";
import apiRequestUpdateActiveTodoPage from "../apiRequests/UPDATE/apiRequestUpdateActiveTodoPage";
import ComponentAddNewItemInput from "../components/ComponentsPageDashboard/ComponentAddNewItemInput";
import ComponentSettingsMenu from "../components/ComponentsPageDashboard/ComponentSettingsMenu";
import apiRequestDeleteIndividualTodoPage from "../apiRequests/DELETE/apiRequestDeleteIndividualTodoPage";
import toast from "react-hot-toast";

const PageDashboard = ({ accountInfo }: { accountInfo: Account }) => {

  const [initialPageLoad, setInitialPageLoad] = useState<boolean>(true);
  const [allTodoPagesFromApi, setAllTodoPagesFromApi] = useState<TodoPage[] | undefined>(undefined);
  const [activeTodoPageInfo, setActiveTodoPageInfo] = useState<TodoPage | undefined>(undefined);
  const [activeTodoPageTodos, setActiveTodoPageTodos] = useState<Todo[] | undefined>(undefined);
  const [pageHeading, setPageHeading] = useState<string>("-1");
  const [pageSubHeading, setPageSubHeading] = useState<string>("");

  const getTodoPagesFromApi = async () => {
    const apiResponse = await GetAllTodoPages(accountInfo.account_id);

    if (typeof apiResponse !== 'string') {
      sortByDate(apiResponse);
    }
  }

  const sortByDate = (todoPages: TodoPage[]) => {
    const todoPagesWithDates = todoPages.map((todoPage) => {
      if (todoPage.todoPage_createdDate) {
        const dateTimeSplit = todoPage.todoPage_createdDate.split(',');
        // console.log(dateTimeSplit);

        const dateSplit = dateTimeSplit[0].split('/');
        const timeSplit = dateTimeSplit[1].split('-');

        // console.log(dateSplit);
        // console.log(timeSplit);

        const todoPageDateObject = new Date(Number(dateSplit[2]), Number(dateSplit[1]) - 1, Number(dateSplit[0]), Number(timeSplit[0]), Number(timeSplit[1]), Number(timeSplit[2]));
        // console.log(todoPageDateObject);

        let todoPageUpdated: any = todoPage;
        todoPageUpdated.todoPage_createdDate = todoPageDateObject;
        return todoPageUpdated;
      }
    });

    const sortedDates = todoPagesWithDates.sort((a: any, b: any) => { return a.todoPage_createdDate.getTime() - b.todoPage_createdDate.getTime() });
    setAllTodoPagesFromApi(sortedDates);


    // const todoPagesWithDates = todoPages.map((todoPage) => {
    //   if (todoPage.todoPage_createdDate) {
    //     const dateSplit = todoPage.todoPage_createdDate.split('-');
    //     const todoPageDateObject = new Date(Number(dateSplit[2]), Number(dateSplit[1]) - 1, Number(dateSplit[0]));

    //     let todoPageUpdated: any = todoPage;
    //     todoPageUpdated.todoPage_createdDate = todoPageDateObject;
    //     return todoPageUpdated;
    //   }
    // });

    // const sortedDates = todoPagesWithDates.sort((a: any, b: any) => { return a.todoPage_createdDate.getTime() - b.todoPage_createdDate.getTime() });
    // setAllTodoPagesFromApi(sortedDates);
  }

  const getTodosForActivePageFromApi = async (givenPageId?: number) => {
    if (activeTodoPageInfo !== undefined) {
      let apiResponse;
      if (givenPageId) {
        apiResponse = await GetAllTodosForAPage(givenPageId);
      } else {
        apiResponse = await GetAllTodosForAPage(activeTodoPageInfo.todoPage_id);
      }
      // console.log(apiReponse);

      if (typeof apiResponse !== 'string') {
        setActiveTodoPageTodos(apiResponse);
      }
    }
  }

  const createNewTodoPage = async () => {
    const apiRepsonse = await apiRequestCreateNewTodoPage(accountInfo.account_id);

    if (typeof apiRepsonse !== 'string') {
      setActiveTodoPageInfo(apiRepsonse);
      await getTodoPagesFromApi();
      await getTodosForActivePageFromApi();
      setPageHeading("-1");
    }
  }

  const changeActiveTodoPage = async (todoPageId: number) => {
    if (allTodoPagesFromApi !== undefined) {

      const activeTodoPage = allTodoPagesFromApi.filter((todoPage) => {
        if (todoPage.todoPage_id === todoPageId) {
          return todoPage;
        }
      });

      setActiveTodoPageInfo(activeTodoPage[0]);
      setPageHeading(activeTodoPage[0].todoPage_heading);

      if (activeTodoPage[0].todoPage_description) {
        setPageSubHeading(activeTodoPage[0].todoPage_heading);
      } else {
        setPageSubHeading("");
      }

      await getTodosForActivePageFromApi(activeTodoPage[0].todoPage_id);
    }
  }

  const changePageHeading = async (userText: string) => {
    setPageHeading(userText);

    await apiRequestUpdateActiveTodoPage({
      todoPage_id: Number(activeTodoPageInfo?.todoPage_id),
      todoPage_heading: userText === '' ? 'untitled' : userText,
      todoPage_createdBy: Number(activeTodoPageInfo?.todoPage_createdBy),
      todoPage_isPageArchived: Boolean(activeTodoPageInfo?.todoPage_isPageArchived),
    }).then(async () => { await getTodoPagesFromApi() });
  }

  const changePageSubHeading = async (userText: string) => {
    setPageSubHeading(userText);

    await apiRequestUpdateActiveTodoPage({
      todoPage_id: Number(activeTodoPageInfo?.todoPage_id),
      todoPage_heading: String(activeTodoPageInfo?.todoPage_heading),
      todoPage_description: String(userText),
      todoPage_createdBy: Number(activeTodoPageInfo?.todoPage_createdBy),
      todoPage_isPageArchived: Boolean(activeTodoPageInfo?.todoPage_isPageArchived),
    }).then(async () => { await getTodoPagesFromApi() });
  }

  const deleteTodoPage = async () => {
    if (activeTodoPageInfo !== undefined && allTodoPagesFromApi !== undefined) {
      await apiRequestDeleteIndividualTodoPage(activeTodoPageInfo.todoPage_id);
      toast.success("Page deleted.");
      setActiveTodoPageInfo(allTodoPagesFromApi[0]);
      getTodoPagesFromApi();
      setPageHeading(allTodoPagesFromApi[0].todoPage_heading);
      setActiveTodoPageTodos(undefined);

    }
  }


  useEffect(() => {

    if (initialPageLoad === true) {
      getTodoPagesFromApi();
      setInitialPageLoad(false);
    }

    if (
      allTodoPagesFromApi !== undefined &&
      allTodoPagesFromApi.length > 0 &&
      activeTodoPageTodos === undefined
    ) {
      setActiveTodoPageInfo(allTodoPagesFromApi[0]);
      getTodosForActivePageFromApi();
    }

  }, [initialPageLoad, allTodoPagesFromApi, activeTodoPageInfo, activeTodoPageTodos]);

  return (
    <HStack justifyContent="space-evenly" spacing="0">
      <VStack>
        <VStack>
          {
            allTodoPagesFromApi !== undefined
              ? allTodoPagesFromApi.map((todoPage: TodoPage) => {
                return (
                  <Button onClick={() => changeActiveTodoPage(todoPage.todoPage_id)} key={todoPage.todoPage_id}>
                    {
                      typeof activeTodoPageInfo !== undefined &&
                        todoPage.todoPage_id === activeTodoPageInfo?.todoPage_id &&
                        pageHeading === ''
                        ? 'untitled'
                        : todoPage.todoPage_heading
                    }
                  </Button>)
              })
              : <></>
          }
          <Button onClick={createNewTodoPage}>Create new page</Button>
        </VStack>
        {
          activeTodoPageInfo !== undefined
            ? <ComponentSettingsMenu deleteTodoPage={deleteTodoPage} />
            : <></>
        }
      </VStack>

      <ComponentActivePageInfo
        activeTodoPageInfo={activeTodoPageInfo}
        activeTodoPageTodos={activeTodoPageTodos}
        getTodoPagesFromApi={getTodoPagesFromApi}
        getTodosForActivePageFromApi={getTodosForActivePageFromApi}
        pageHeading={pageHeading}
        setPageHeading={setPageHeading}
        changePageHeading={changePageHeading}
        pageSubHeading={pageSubHeading}
        setPageSubHeading={setPageSubHeading}
        changePageSubHeading={changePageSubHeading}
      />
      {
        activeTodoPageInfo !== undefined
          ? <ComponentAddNewItemInput
            activeTodoPageInfo={activeTodoPageInfo}
            activeTodoPageTodos={activeTodoPageTodos}
            setActiveTodoPageTodos={setActiveTodoPageTodos}
          />
          : <></>
      }
    </HStack>
  )
}

export default PageDashboard