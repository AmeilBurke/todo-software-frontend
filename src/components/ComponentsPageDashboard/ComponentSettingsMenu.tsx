import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { TfiAngleDown } from 'react-icons/tfi'
import { Todo, TodoPage } from '../../types/TypeIndex'
import apiRequestDeleteIndividualTodoPage from '../../apiRequests/DELETE/apiRequestDeleteIndividualTodoPage'


// implementing delete active page
const ComponentSettingsMenu = (
    {
        deleteTodoPage,
    }:
        {
            deleteTodoPage: () => void
        }
) => {

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<TfiAngleDown />}>
                Actions
            </MenuButton>
            <MenuList>
                <MenuItem onClick={deleteTodoPage} >Delete Page</MenuItem>
            </MenuList>
        </Menu>
    )
}

export default ComponentSettingsMenu