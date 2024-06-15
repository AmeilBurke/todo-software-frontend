import React, { useEffect, useState } from "react";
import { Todo } from "../../types/TypeIndex";
import {
    Checkbox,
    HStack,
    Input,
    ListItem,
    UnorderedList,
} from "@chakra-ui/react";
import apiRequestUpdateActiveTodoList from "../../apiRequests/UPDATE/apiRequestUpdateActiveTodoList";
import apiRequestDeleteIndividualTodo from "../../apiRequests/DELETE/apiRequestDeleteIndividualTodo";
import ComponentModalConfirmDelete from "./ComponentModalConfirmDelete";

const ComponentTodoPageContent = ({
    todo,
    activeTodoPageTodos,
    getTodosForActivePageFromApi,
}: {
    todo: Todo,
    activeTodoPageTodos: Todo[],
    getTodosForActivePageFromApi: (givenPageId?: number) => Promise<void>,
}) => {
    const [userEditText, setUserEditText] = useState<string>("-1");
    const [itemContent, setItemContent] = useState<string>("");
    const [itemPrefix, setItemPrefix] = useState<string>("");

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

    const updateTodoHandler = async (event: React.KeyboardEvent<HTMLInputElement> | boolean) => {
        if (typeof event !== "boolean") {
            if (event.key === "Enter") {
                await updateTodo();
            }
        } else {
            await updateTodo();
        }

    };

    const updateTodo = async () => {
        let allActivePageTodoIndex = activeTodoPageTodos.findIndex(todoElement => todoElement.todo_id === todo.todo_id);
        let allActivePageTodos = activeTodoPageTodos;

        if (userEditText === "-1") {
            allActivePageTodos[allActivePageTodoIndex] = { todo_id: todo.todo_id, todo_content: todo.todo_content, todo_dateCreated: todo.todo_dateCreated, todoPage_id: todo.todoPage_id }
        } else {
            allActivePageTodos[allActivePageTodoIndex] = { todo_id: todo.todo_id, todo_content: `${itemPrefix}-${userEditText}`, todo_dateCreated: todo.todo_dateCreated, todoPage_id: todo.todoPage_id }
        }

        allActivePageTodos.map(async (todoElement) => {
            await apiRequestUpdateActiveTodoList({
                todoId: Number(todoElement.todo_id),
                todoContent: todoElement.todo_content
            }).then(async () => {
                await getTodosForActivePageFromApi(todo.todoPage_id);
            });
        });
    }

    const setIsTodoCompleted = async () => {
        await apiRequestUpdateActiveTodoList({ todoId: Number(todo.todo_id), todoContent: todo.todo_content, todoIsCompleted: !todo.todo_isCompleted });
    }

    const deleteTodo = async () => {
        await apiRequestDeleteIndividualTodo(Number(todo.todo_id)).then(async () => {
            await getTodosForActivePageFromApi(todo.todoPage_id);
        });
    };

    if (itemPrefix === "li") {
        return (
            <HStack w="100%">
                <ComponentModalConfirmDelete deleteTodo={deleteTodo} />
                <UnorderedList w="100%">
                    <ListItem w="100%">
                        <Input
                            w="100%"
                            value={userEditText === "-1" ? itemContent : userEditText}
                            onChange={(e) => setUserEditText(e.target.value)}
                            onKeyDown={(e) => updateTodoHandler(e)}
                            onBlur={() => updateTodoHandler(true)}
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
            <HStack w="100%">
                <ComponentModalConfirmDelete deleteTodo={deleteTodo} />
                <Checkbox
                    defaultChecked={todo.todo_isCompleted === true ? true : false}
                    onChange={setIsTodoCompleted}
                >

                </Checkbox>
                <Input
                    w="100%"
                    value={userEditText === "-1" ? itemContent : userEditText}
                    onChange={(e) => setUserEditText(e.target.value)}
                    onKeyDown={(e) => updateTodoHandler(e)}
                    onBlur={() => updateTodoHandler(true)}
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
                    w="100%"
                    value={userEditText === "-1" ? itemContent : userEditText}
                    onChange={(e) => setUserEditText(e.target.value)}
                    onKeyDown={(e) => updateTodoHandler(e)}
                    onBlur={() => updateTodoHandler(true)}
                    placeholder="text"
                    variant="unstyled"
                />
            </HStack>
        );
    }
};

export default ComponentTodoPageContent;
