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

const PageDashboard = ({ accountInfo }: { accountInfo: Account }) => {

  const [initialPageLoad, setInitialPageLoad] = useState<boolean>(true);
  const [allTodoPagesFromApi, setAllTodoPagesFromApi] = useState<TodoPage[] | undefined>(undefined);
  const [activeTodoPageInfo, setActiveTodoPageInfo] = useState<TodoPage | undefined>(undefined);
  const [activeTodoPageTodos, setActiveTodoPageTodos] = useState<Todo[] | undefined>(undefined);

  const [pageHeading, setPageHeading] = useState<string>("-1");

  const getTodoPagesFromApi = async () => {
    const apiResponse = await GetAllTodoPages(accountInfo.account_id);

    if (typeof apiResponse !== 'string') {
      sortByDate(apiResponse);
    }
  }

  const sortByDate = (todoPages: TodoPage[]) => {
    const todoPagesWithDates = todoPages.map((todoPage) => {
      if (todoPage.todoPage_createdDate) {
        const dateSplit = todoPage.todoPage_createdDate.split('-');
        const todoPageDateObject = new Date(Number(dateSplit[2]), Number(dateSplit[1]) - 1, Number(dateSplit[0]));

        let todoPageUpdated: any = todoPage;
        todoPageUpdated.todoPage_createdDate = todoPageDateObject;
        return todoPageUpdated;
      }
    });

    const sortedDates = todoPagesWithDates.sort((a: any, b: any) => { return a.todoPage_createdDate.getTime() - b.todoPage_createdDate.getTime() });
    setAllTodoPagesFromApi(sortedDates);
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
    }
    // redone gets, redone creates, need to do refactor creating todos
    // not forgetting changing activePageInfo & running getTodosForActivePageFromApi()
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

      <ComponentActivePageInfo
        activeTodoPageInfo={activeTodoPageInfo}
        activeTodoPageTodos={activeTodoPageTodos}
        getTodoPagesFromApi={getTodoPagesFromApi}
        getTodosForActivePageFromApi={getTodosForActivePageFromApi}
        pageHeading={pageHeading}
        setPageHeading={setPageHeading}
        changePageHeading={changePageHeading}
      />
      <ComponentAddNewItemInput
        activeTodoPageInfo={activeTodoPageInfo}
        activeTodoPageTodos={activeTodoPageTodos}
        setActiveTodoPageTodos={setActiveTodoPageTodos}
      />
    </HStack>
  )
}

export default PageDashboard


// const [intialPageLoad, setIntialPageLoad] = useState<boolean>(true);
// const [allPagesArray, setAllPagesArray] = useState<TodoPage[]>([]);
// const [allPagesTodoArray, setAllPagesTodoArray] = useState<Todo[]>([]);
// const [activePageId, setActivePageId] = useState<number>(-1);
// const [activePageInfo, setActivePageInfo] = useState<TodoPage | undefined>(undefined);
// const [activePageTodoArray, setActivePageTodoArray] = useState<Todo[]>([]);

// // re-write this to make it more clearer now that backend has been implemented.

// // start with getting pages, implementing empty array checks
// // creating new pages
// // deleting pages
// // editing pages

// const getTodoArrayForActivePage = async (pageId: number) => {
//   if (typeof accountInfo !== "undefined") {
//     const todoArray = await GetAllTodosForAPage(pageId);
//     // console.log(todoArray);

//     if (typeof todoArray !== 'string') {
//       setActivePageTodoArray(todoArray);
//     }
//   }
// }

// const getAllTodoPages = async () => {
//   const apiResponse = await GetAllTodoPages(accountInfo.account_id);
//   console.log(apiResponse);

//   if (typeof apiResponse !== 'string') {
//     setAllPagesArray(apiResponse[0]);
//     setAllPagesTodoArray(apiResponse[1]);
//     setIntialPageLoad(false);
//   }
// }

// const setDefaultActivePage = async () => {
//   console.log(`setting default page`);

//   if (allPagesArray.length > 0) {
//     setActivePageId(allPagesArray[0].todoPage_id);
//     setActivePageInfo(allPagesArray[0]);
//   } else {
//     setActivePageId(-1);
//   }


//   const apiResponse = await GetAllTodosForAPage(allPagesArray[0].todoPage_id);
//   if (typeof apiResponse != 'string') {
//     // console.log(apiResponse);
//     setActivePageTodoArray(apiResponse);
//   }
// }

// const getActivePageInfo = () => {
//   const activeTodoPageInfo = allPagesArray.filter((todoPage: TodoPage) => {
//     if (todoPage.todoPage_id === activePageId) {
//       return todoPage;
//     }
//   });
//   setActivePageInfo(activeTodoPageInfo[0]);
//   // console.log(activeTodoPageInfo);
// }

// const createNewTodoPage = async () => {
//   const newTodo = await apiRequestCreateNewTodoPage(accountInfo.account_id);

//   if (typeof newTodo !== 'string') {
//     setActivePageId(newTodo.todoPage_id);
//     getActivePageInfo();
//     await getAllTodoPages();
//     await getTodoArrayForActivePage(newTodo.todoPage_id);
//   }
// }

// const deleteTodoPage = async () => {
//   const test = await apiRequestDeleteIndividualTodoPage(activePageId);

//   if (typeof test !== 'string') {
//     await getAllTodoPages().then(async () => {
//       await setDefaultActivePage();
//       setActivePageId(-1);
//     });
//   }

// }

// const changeActivePage = async (pageId: number) => {

//   if (pageId !== activePageId) {
//     setActivePageId(pageId);
//     getTodoArrayForActivePage(pageId);
//     getActivePageInfo();
//   }
// }

// useEffect(() => {

//   if (intialPageLoad) {
//     getAllTodoPages();
//   }

//   if (allPagesArray.length !== 0 && activePageId === -1) {
//     setDefaultActivePage();
//   }

//   // getActivePageInfo();
//   console.log(activePageInfo);

// }, [allPagesArray, activePageId, activePageInfo, activePageTodoArray]);


// return (
//   <HStack justifyContent="space-evenly" spacing="0">
//     <VStack>
//       <VStack justifyContent="space-between">
//         {
//           allPagesArray.map((todoPage) => {
//             return <Button key={todoPage.todoPage_id} onClick={() => { changeActivePage(todoPage.todoPage_id) }}>{todoPage.todoPage_heading}</Button>
//           })
//         }
//         <Button onClick={createNewTodoPage}>Create new page</Button>
//         {
//           activePageInfo !== undefined
//             ? <ComponentSettingsMenu deleteTodoPage={deleteTodoPage} />
//             : <></>
//         }
//       </VStack>
//     </VStack>
//     <VStack>
//       <HStack></HStack>
//       <VStack alignItems="flex-start">

//         {
//           activePageInfo !== undefined
//             ? <Text>{activePageInfo.todoPage_heading}</Text>
//             : <></>
//         }

//         {
//           activePageTodoArray.map((todo: Todo) => {
//             return <ComponentTodoPageContent key={todo.todo_id} todo={todo} activePageTodoArray={activePageTodoArray} setActivePageTodoArray={setActivePageTodoArray} />
//           })
//         }
//         {
//           activePageId === -1
//             ? <Text>create a new page using the create new page button</Text>
//             : <ComponentAddNewItemInput activePageTodoArray={activePageTodoArray} setActivePageTodoArray={setActivePageTodoArray} activePageId={activePageId} />
//         }
//       </VStack>
//     </VStack>
//   </HStack >
// )