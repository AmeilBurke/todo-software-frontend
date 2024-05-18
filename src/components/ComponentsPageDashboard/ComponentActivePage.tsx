import { VStack, Input, Divider, UnorderedList, ListItem, Text } from '@chakra-ui/react'
import { Todo, TodoPage } from '../../types/TypeIndex'

const ComponentActivePage = ({ setActivePageInfo, activePageInfo, activePageTodoArray }: { setActivePageInfo: React.Dispatch<React.SetStateAction<TodoPage | undefined>>, activePageInfo: TodoPage | undefined, activePageTodoArray: Todo[] }) => {

    const userHeadingHandler = (headingText: string) => {

        if (activePageInfo !== undefined) {
            setActivePageInfo({
                todoPage_id: activePageInfo.todoPage_id,
                todoPage_heading: headingText,
                todoPage_createdBy: activePageInfo.todoPage_createdBy,
                todoPage_isPageArchived: activePageInfo.todoPage_isPageArchived,
                todoPage_createdDate: activePageInfo.todoPage_createdDate,
                todoPage_description: activePageInfo.todoPage_description
            })
        }

    }

    if (activePageInfo !== undefined) {
        return (
            <VStack w="100%" alignItems="flex-start">
                <Input value={activePageInfo.todoPage_heading} onChange={(e) => userHeadingHandler(e.target.value)} variant="unstyled" _placeholder={{ opacity: 1, color: 'black' }} />
                <Divider />
                {
                    activePageInfo.todoPage_description
                        ? <Text>{activePageInfo.todoPage_description}</Text>
                        : <></>
                }
                <UnorderedList spacing="4">
                    {
                        activePageTodoArray.length > 0
                            ? activePageTodoArray.map(todo => { return <ListItem key={todo.todo_id} >{todo.todo_content}</ListItem> })
                            : <></>
                    }
                </UnorderedList>
            </VStack>
        )
    } else {
        <Text>create or choose a page to get started</Text>
    }
}

export default ComponentActivePage
