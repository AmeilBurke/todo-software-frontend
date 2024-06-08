import { Menu, MenuButton, Button, MenuList, MenuItem, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { TfiAngleDown } from 'react-icons/tfi';

const ComponentSettingsMenu = (
    {
        deleteTodoPage,
    }:
        {
            deleteTodoPage: () => Promise<void>
        }
) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Menu>
            <MenuButton as={Button} rightIcon={<TfiAngleDown />}>Actions</MenuButton>
            <MenuList>
                <>
                    <MenuItem onClick={onOpen}>Delete Page</MenuItem>

                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Delete Page?</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={onClose} variant='ghost'>Cancel</Button>
                                <Button colorScheme='red' mr={3} onClick={() => {
                                    deleteTodoPage();
                                    onClose();
                                }}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            </MenuList>
        </Menu >
    )
}

export default ComponentSettingsMenu