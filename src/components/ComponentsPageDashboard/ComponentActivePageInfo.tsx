import { VStack, Input, Text, Divider } from '@chakra-ui/react'
import { TodoPage, Todo } from '../../types/TypeIndex'
import { useEffect, useState } from 'react';
import ComponentTodoPageContent from './ComponentTodoPageContent';

const ComponentActivePageInfo = ({
    activeTodoPageInfo,
    activeTodoPageTodos,
    getTodosForActivePageFromApi,
    pageHeading,
    setPageHeading,
    changePageHeading,
    pageSubHeading,
    setPageSubHeading,
    changePageSubHeading
}: {
    activeTodoPageInfo: TodoPage | undefined,
    activeTodoPageTodos: Todo[] | undefined,
    getTodosForActivePageFromApi: (givenPageId?: number) => Promise<void>,
    getTodoPagesFromApi: () => Promise<void>,
    pageHeading: string,
    setPageHeading: React.Dispatch<React.SetStateAction<string>>,
    changePageHeading: (userText: string) => Promise<void>,
    pageSubHeading: string | undefined,
    setPageSubHeading: React.Dispatch<React.SetStateAction<string>>,
    changePageSubHeading: (userText: string) => Promise<void>,

}) => {

    const [isPageArchived, setIsPageArchived] = useState<boolean>();

    useEffect(() => {

        if (activeTodoPageInfo?.todoPage_heading && pageHeading === "-1") {
            setPageHeading(activeTodoPageInfo.todoPage_heading);
        }

        if (activeTodoPageInfo?.todoPage_description) {
            setPageSubHeading(activeTodoPageInfo.todoPage_description);
        }

        if (activeTodoPageInfo?.todoPage_isPageArchived) {
            setIsPageArchived(activeTodoPageInfo.todoPage_isPageArchived);
        }

    }, [pageHeading, isPageArchived]);

    return (
        <VStack>
            {
                activeTodoPageInfo !== undefined
                    ? <>
                        <Input onChange={(e) => changePageHeading(e.target.value)} value={pageHeading === "-1" ? activeTodoPageInfo.todoPage_heading : pageHeading} placeholder={pageHeading === '' ? 'untitled' : activeTodoPageInfo.todoPage_heading} variant="unstyled"></Input>
                        <Divider />
                      </>
                    : <Text>Create a new page by using the 'Create new page' button.</Text>
            }
            {
                activeTodoPageInfo === undefined
                    ? <></>
                    : <Input
                        onChange={(e) => changePageSubHeading(e.target.value)}
                        value={activeTodoPageInfo?.todoPage_description === "-1" ? "testing" : pageSubHeading}
                        placeholder={activeTodoPageInfo?.todoPage_description === "-1" ? pageSubHeading : "Put a description for the page here."}
                        variant="unstyled">
                    </Input>
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