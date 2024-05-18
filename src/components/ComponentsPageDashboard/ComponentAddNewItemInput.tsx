import { Input, VStack, HStack } from '@chakra-ui/react'
import { Todo } from '../../types/TypeIndex'
import { TfiCheckBox, TfiMenuAlt, TfiText } from 'react-icons/tfi'
import { useState } from 'react';
import apiRequestCreateNewTodo from '../../apiRequests/POST/apiRequestCreateNewTodo';

const ComponentAddNewItemInput = ({ activePageTodoArray, setActivePageTodoArray, activePageId, getTodoArrayForAPage }:
    {
        activePageTodoArray: Todo[], setActivePageTodoArray: React.Dispatch<React.SetStateAction<Todo[]>>, activePageId: number, getTodoArrayForAPage: () => Promise<void>
    }) => {


    const [userInputText, setUserInputText] = useState<string>("");
    const [userInputListItem, setUserInputListItem] = useState<string>("");
    const [userInputTodoItem, setUserInputTodoItem] = useState<string>("");



    const createNewTodo = async (event: React.KeyboardEvent<HTMLInputElement>, inputType: string) => {


        if (event.key === "Enter") {
            let apiResponse: any;
            event.preventDefault();

            if (inputType === "text") {
                apiResponse = await apiRequestCreateNewTodo({ todo_content: `t-${userInputText}`, todoPage_id: activePageId });
            }

            if (inputType === "listItem") {
                apiResponse = await apiRequestCreateNewTodo({ todo_content: `li-${userInputListItem}`, todoPage_id: activePageId });
            }

            if (inputType === "todoItem") {
                apiResponse = await apiRequestCreateNewTodo({ todo_content: `c-${userInputTodoItem}`, todoPage_id: activePageId });
            }

            if (typeof apiResponse !== "string") {

                // console.log(activePageTodoArray);
                setActivePageTodoArray([...activePageTodoArray, apiResponse]);
                // console.log(activePageTodoArray);
                getTodoArrayForAPage();
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
                <Input value={userInputText} onBlur={() => setUserInputText("")} onChange={(e) => { setUserInputText(e.target.value) }} onKeyDown={(event) => { createNewTodo(event, "text") }} variant="flushed" placeholder='text' />
            </HStack>

            <HStack>
                <TfiMenuAlt />
                <Input value={userInputListItem} onBlur={() => setUserInputListItem("")} onChange={(e) => { setUserInputListItem(e.target.value) }} onKeyDown={(event) => createNewTodo(event, "listItem")} variant="flushed" placeholder='list item' />
            </HStack>
            <HStack>
                <TfiCheckBox />
                <Input value={userInputTodoItem} onBlur={() => setUserInputTodoItem("")} onChange={(e) => { setUserInputTodoItem(e.target.value) }} onKeyDown={(event) => createNewTodo(event, "todoItem")} variant="flushed" placeholder='todo item' />
            </HStack>
        </VStack>
    )
}

export default ComponentAddNewItemInput