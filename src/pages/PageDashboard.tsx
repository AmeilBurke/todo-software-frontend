import { useEffect, useState, } from "react"
import { Account, Todo, TodoPage, } from "../types/TypeIndex"
import {
  VStack, Button, Drawer,
  DrawerBody,
  IconButton,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Stack,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
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
import { TfiAngleDown, TfiSettings } from "react-icons/tfi";

const PageDashboard = ({ accountInfo, setAccountInfo }: { accountInfo: Account, setAccountInfo: React.Dispatch<React.SetStateAction<Account | undefined>> }) => {

  const [initialPageLoad, setInitialPageLoad] = useState<boolean>(true);
  const [allTodoPagesFromApi, setAllTodoPagesFromApi] = useState<TodoPage[] | undefined>(undefined);
  const [activeTodoPageInfo, setActiveTodoPageInfo] = useState<TodoPage | undefined>(undefined);
  const [activeTodoPageTodos, setActiveTodoPageTodos] = useState<Todo[] | undefined>(undefined);
  const [pageHeading, setPageHeading] = useState<string>("-1");
  const [pageSubHeading, setPageSubHeading] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTodoPagesFromApi = async () => {
    const apiResponse = await GetAllTodoPages(accountInfo.account_id);

    if (typeof apiResponse !== 'string') {
      sortTodoPagesByDate(apiResponse);
      // console.log(apiResponse);
      console.log(activeTodoPageInfo);
    }
  }

  const sortTodoPagesByDate = (todoPages: TodoPage[]) => {
    const todoPagesWithDates = todoPages.map((todoPage) => {
      if (todoPage.todoPage_createdDate) {
        const dateTimeSplit = todoPage.todoPage_createdDate.split(',');

        const dateSplit = dateTimeSplit[0].split('/');
        const timeSplit = dateTimeSplit[1].split('-');

        const todoPageDateObject = new Date(Number(dateSplit[2]), Number(dateSplit[1]) - 1, Number(dateSplit[0]), Number(timeSplit[0]), Number(timeSplit[1]), Number(timeSplit[2]));

        let todoPageUpdated: any = todoPage;
        todoPageUpdated.todoPage_createdDate = todoPageDateObject;
        return todoPageUpdated;
      }
    });

    const sortedDates = todoPagesWithDates.sort((a: any, b: any) => { return a.todoPage_createdDate.getTime() - b.todoPage_createdDate.getTime() });
    setAllTodoPagesFromApi(sortedDates);
  }

  const sortTodosForActivePageByDate = (todos: Todo[]) => {

    const todosWithDates = todos.map((todo: Todo) => {

      if (typeof todo.todo_dateCreated === "string") {
        const dateTimeSplit = todo.todo_dateCreated.split(",");
        const dateSplit = dateTimeSplit[0].split('/');
        const timeSplit = dateTimeSplit[1].split('-');

        const todoDateObject = new Date(Number(dateSplit[2]), Number(dateSplit[1]) - 1, Number(dateSplit[0]), Number(timeSplit[0]), Number(timeSplit[1]), Number(timeSplit[2]));

        let todoUpdated: any = todo;
        todoUpdated.todo_createdDate = todoDateObject;
        return todoUpdated;
      }
    });

    const sortedDates = todosWithDates.sort((a: any, b: any) => { return a.todo_createdDate.getTime() - b.todo_createdDate.getTime() });
    setActiveTodoPageTodos(sortedDates);
  }

  const getTodosForActivePageFromApi = async (givenPageId?: number) => {
    if (activeTodoPageInfo !== undefined) {
      let apiResponse;
      if (givenPageId) {
        apiResponse = await GetAllTodosForAPage(givenPageId);
      } else {
        apiResponse = await GetAllTodosForAPage(activeTodoPageInfo.todoPage_id);
      }

      if (typeof apiResponse !== 'string') {
        sortTodosForActivePageByDate(apiResponse);
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


      getTodoPagesFromApi();
      setPageHeading(allTodoPagesFromApi[0].todoPage_heading);

      setActiveTodoPageTodos(undefined);
      setActiveTodoPageInfo(undefined);
      setAllTodoPagesFromApi(undefined);
    }
  }

  const signUserOut = () => {
    setAccountInfo(undefined);
    setInitialPageLoad(true);
    setAllTodoPagesFromApi(undefined);
    setActiveTodoPageInfo(undefined);
    setActiveTodoPageTodos(undefined);
    setPageHeading("-1");
    setPageSubHeading("");
  }

  const menuItems = allTodoPagesFromApi !== undefined
    ? allTodoPagesFromApi.map((todoPage: TodoPage) => {
      return (
        <Button w="full" py={[4]} onClick={() => { changeActiveTodoPage(todoPage.todoPage_id); onClose() }} key={todoPage.todoPage_id}>
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

  const mobileMenu =
    (
      <Box display={["block", null, null, "none"]} py={[8]} >
        <IconButton aria-label='Search database' onClick={onOpen} icon={<TfiAngleDown />} />
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Pages</DrawerHeader>
            <DrawerBody>
              <VStack alignItems="flex-start" spacing={4}>
                {
                  menuItems
                }
                <Button w="full" onClick={() => { createNewTodoPage(); onClose(); }}>Create new page</Button>
                {
                  activeTodoPageInfo !== undefined
                    ? <ComponentSettingsMenu deleteTodoPage={deleteTodoPage} onCloseDrawer={onClose} />
                    : <></>
                }
                <Box mb={8}>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<TfiSettings />}>
                      Account
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={signUserOut} >Sign out</MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    )

  const desktopMenu = (
    <Box display={["none", null, null, "block"]} maxH={[null, null, null, "100vh"]} overflow={[null, null, null, "scroll"]} borderRight="1px" borderColor='gray.200'>
      <VStack py={[8]} pr={[8]} mb={4} alignItems="flex-start" spacing={4}>
        {
          menuItems
        }
        <Button w="full" onClick={createNewTodoPage}>Create new page</Button>
      </VStack>
      {
        activeTodoPageInfo !== undefined
          ? <ComponentSettingsMenu deleteTodoPage={deleteTodoPage} onCloseDrawer={onClose} />
          : <></>
      }
      <Box mb={8}>
        <Menu>
          <MenuButton as={Button} rightIcon={<TfiSettings />}>
            Account
          </MenuButton>
          <MenuList>
            <MenuItem onClick={signUserOut} >Sign out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  )

  return (
    <Stack mx={[8]} my={[0]} direction={["column", null, null, "row"]} alignItems={["flex-start"]} justifyContent="flex-start" spacing={8} overflow={["hidden"]}>
      <VStack>
        {mobileMenu}
        {desktopMenu}
      </VStack>

      <VStack
        w="100%"
        mb={[8]}
        py={[null, null, null, 8]}
        maxH={[null, null, null, "100vh"]}
        overflow={[null, null, null, "scroll"]}
        direction={["column-reverse"]}
        alignItems={["flex-start"]}
        justifyContent="flex-start"
        spacing={8}
      >
        {
          activeTodoPageInfo !== undefined
            ? <ComponentAddNewItemInput
              activeTodoPageInfo={activeTodoPageInfo}
              activeTodoPageTodos={activeTodoPageTodos}
              setActiveTodoPageTodos={setActiveTodoPageTodos}
            />
            : <></>
        }

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
      </VStack>
    </Stack>
  )
}

export default PageDashboard