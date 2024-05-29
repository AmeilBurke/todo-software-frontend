import { VStack, Input, Text, Divider } from '@chakra-ui/react'
import { TodoPage, Todo } from '../../types/TypeIndex'
import { useEffect, useState } from 'react';
import ComponentTodoPageContent from './ComponentTodoPageContent';
import apiRequestUpdateActiveTodoPage from '../../apiRequests/UPDATE/apiRequestUpdateActiveTodoPage';

const ComponentActivePageInfo = ({
    activeTodoPageInfo,
    activeTodoPageTodos,
    setActiveTodoPageTodos,
    getTodoPagesFromApi,
    getTodosForActivePageFromApi
}: {
    activeTodoPageInfo: TodoPage | undefined,
    activeTodoPageTodos: Todo[] | undefined,
    setActiveTodoPageTodos: React.Dispatch<React.SetStateAction<Todo[] | undefined>>,
    getTodoPagesFromApi: () => Promise<void>,
    getTodosForActivePageFromApi: (givenPageId?: number) => Promise<void>,
}) => {

    const [pageHeading, setPageHeading] = useState<string>("-1");
    const [pageDescription, setPageDescription] = useState<string | undefined>();
    const [isPageArchived, setIsPageArchived] = useState<boolean>();

    useEffect(() => {

        if (activeTodoPageInfo?.todoPage_heading && pageHeading === "-1") {
            setPageHeading(activeTodoPageInfo.todoPage_heading);
        }

        if (activeTodoPageInfo?.todoPage_description) {
            setPageDescription(activeTodoPageInfo.todoPage_description);
        }

        if (activeTodoPageInfo?.todoPage_isPageArchived) {
            setIsPageArchived(activeTodoPageInfo.todoPage_isPageArchived);
        }

    }, [pageHeading, pageDescription, isPageArchived]);

    const changePageHeading = async (userText: string) => {
        console.log(userText);
        console.log({
            todoPage_id: Number(activeTodoPageInfo?.todoPage_id),
            todoPage_heading: userText,
            todoPage_createdBy: Number(activeTodoPageInfo?.todoPage_createdBy),
            todoPage_isPageArchived: Boolean(activeTodoPageInfo?.todoPage_isPageArchived),
        })

        setPageHeading(userText);

        console.log({
            todoPage_id: Number(activeTodoPageInfo?.todoPage_id),
            todoPage_heading: userText,
            todoPage_createdBy: Number(activeTodoPageInfo?.todoPage_createdBy),
            todoPage_isPageArchived: Boolean(activeTodoPageInfo?.todoPage_isPageArchived)
        })

        await apiRequestUpdateActiveTodoPage({
            todoPage_id: Number(activeTodoPageInfo?.todoPage_id),
            todoPage_heading: userText,
            todoPage_createdBy: Number(activeTodoPageInfo?.todoPage_createdBy),
            todoPage_isPageArchived: Boolean(activeTodoPageInfo?.todoPage_isPageArchived),
        }).then(() => { getTodoPagesFromApi() });
    }


    return (
        <VStack>
            {
                activeTodoPageInfo !== undefined
                    ? <><Input onChange={(e) => changePageHeading(e.target.value)} value={pageHeading === "-1" ? activeTodoPageInfo.todoPage_heading : pageHeading} placeholder={activeTodoPageInfo.todoPage_heading} variant="unstyled"></Input>
                        <Divider /></>
                    : <Text>Create a new page by using the 'Create new page' button.</Text>
            }
            {
                activeTodoPageInfo?.todoPage_description
                    ? <Input onChange={(e) => setPageHeading(e.target.value)} value={pageDescription} placeholder={activeTodoPageInfo.todoPage_description} variant="unstyled">{activeTodoPageInfo.todoPage_description}</Input>
                    : <Input onChange={(e) => setPageHeading(e.target.value)} value={pageDescription} placeholder='Put a description for the page here.' variant="unstyled"></Input>
            }
            {
                activeTodoPageInfo !== undefined && activeTodoPageTodos !== undefined
                    ? activeTodoPageTodos.map((todo: Todo) => {
                        return (
                            <ComponentTodoPageContent
                                key={todo.todo_id}
                                todo={todo}
                                activeTodoPageTodos={activeTodoPageTodos}
                                getTodosForActivePageFromApi={getTodosForActivePageFromApi}
                            />
                        )
                    })
                    : <></>
            }
        </VStack>
    )
}

export default ComponentActivePageInfo