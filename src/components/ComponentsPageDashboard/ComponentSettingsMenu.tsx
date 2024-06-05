import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';
import { TfiAngleDown } from 'react-icons/tfi';

const ComponentSettingsMenu = (
    {
        deleteTodoPage,
    }:
        {
            deleteTodoPage: () => Promise<void>
        }
) => {

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<TfiAngleDown />}>Actions</MenuButton>
            <MenuList>
                <MenuItem onClick={deleteTodoPage}>Delete Page</MenuItem>
            </MenuList>
        </Menu>
    )
}

export default ComponentSettingsMenu