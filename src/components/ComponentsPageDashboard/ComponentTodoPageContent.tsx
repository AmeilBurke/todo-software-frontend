import React, { useEffect, useState } from "react";
import { Todo } from "../../types/TypeIndex";
import {
    Box,
    Checkbox,
    HStack,
    Input,
    List,
    ListItem,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import { TfiTrash } from "react-icons/tfi";
import apiRequestUpdateActiveTodoList from "../../apiRequests/UPDATE/apiRequestUpdateActiveTodoList";
import GetAllTodosForAPage from "../../apiRequests/GET/GetAllTodosForAPage";
import apiRequestDeleteIndividualTodo from "../../apiRequests/DELETE/apiRequestDeleteIndividualTodo";
import ComponentModalConfirmDelete from "./ComponentModalConfirmDelete";

const ComponentTodoPageContent = ({
    todo,
    activePageTodoArray,
    setActivePageTodoArray,
}: {
    todo: Todo;
    activePageTodoArray: Todo[];
    setActivePageTodoArray: React.Dispatch<React.SetStateAction<Todo[]>>;
}) => {
    const [userEditText, setUserEditText] = useState<string>("-1");
    const [itemContent, setItemContent] = useState<string>("");
    const [itemPrefix, setItemPrefix] = useState<string>("");
    const [inputTypeActive, setInputTypeActive] = useState<string>("");

    const [testingUseState, setTestingUseState] = useState<any>();

    useEffect(() => {
        let firstDashIndex = todo.todo_content.indexOf("-");
        let prefix = todo.todo_content.substring(0, firstDashIndex);
        let content = todo.todo_content.substring(firstDashIndex + 1);

        if (itemContent === "") {
            setItemContent(content);
        }

        if (itemPrefix === "") {
            setItemPrefix(prefix);
        }
    }, []);

    const updateTodo = async (event: React.KeyboardEvent<HTMLInputElement> | boolean) => {

        if (typeof event !== 'boolean') {
            if (event.key === "Enter") {
                await apiRequestUpdateActiveTodoList({
                    todoId: Number(todo.todo_id),
                    todoContent: `${itemPrefix}-${userEditText}`,
                });
                await updateActivePageTodos();
            }
        } else {
            await apiRequestUpdateActiveTodoList({
                todoId: Number(todo.todo_id),
                todoContent: `${itemPrefix}-${userEditText}`,
            });
            await updateActivePageTodos();
        }
    };

    const deleteTodo = async () => {
        await apiRequestDeleteIndividualTodo(Number(todo.todo_id));
        await updateActivePageTodos();
    };

    const updateActivePageTodos = async () => {
        const getTodoArrayForActivePageApiResponse = await GetAllTodosForAPage(todo.todoPage_id);

        if (typeof getTodoArrayForActivePageApiResponse !== 'string') {
            setActivePageTodoArray(getTodoArrayForActivePageApiResponse);
        }
    }

    if (itemPrefix === "li") {
        return (
            <HStack>
                <ComponentModalConfirmDelete deleteTodo={deleteTodo} />
                <UnorderedList>
                    <ListItem>
                        <Input
                            value={userEditText === "-1" ? itemContent : userEditText}
                            onClick={() => setInputTypeActive("listItem")}
                            onChange={(e) => setUserEditText(e.target.value)}
                            onKeyDown={(e) => updateTodo(e)}
                            onBlur={() => updateTodo(true)}
                            placeholder="list"
                            variant="unstyled"
                        />
                    </ListItem>
                </UnorderedList>
            </HStack>
        );
    }

    if (itemPrefix === "c") {
        return (
            <HStack>
                <ComponentModalConfirmDelete deleteTodo={deleteTodo} />
                <Checkbox></Checkbox>
                <Input
                    value={userEditText === "-1" ? itemContent : userEditText}
                    onClick={() => setInputTypeActive("todoItem")}
                    onChange={(e) => setUserEditText(e.target.value)}
                    onKeyDown={(e) => updateTodo(e)}
                    onBlur={() => updateTodo(true)}
                    placeholder="to-do"
                    variant="unstyled"
                />
            </HStack>
        );
    }

    if (itemPrefix === "t") {
        return (
            <HStack>
                <ComponentModalConfirmDelete deleteTodo={deleteTodo} />
                <Input
                    value={userEditText === "-1" ? itemContent : userEditText}
                    onClick={() => setInputTypeActive("textItem")}
                    onChange={(e) => setUserEditText(e.target.value)}
                    onKeyDown={(e) => updateTodo(e)}
                    onBlur={() => updateTodo(true)}
                    placeholder="text"
                    variant="unstyled"
                />
            </HStack>
        );
    }
};

export default ComponentTodoPageContent;
