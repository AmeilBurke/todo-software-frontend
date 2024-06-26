import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, IconButton } from '@chakra-ui/react'
import { TfiTrash } from 'react-icons/tfi';

const ComponentModalConfirmDelete = ({ deleteTodo }: { deleteTodo: () => void }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <IconButton size={["sm"]} icon={<TfiTrash />} bg="transparent" onClick={() => { onOpen(); }} aria-label={'delete todo button'} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered={true} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete item?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Click the button below to confirm you want to delete this item.
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => { onClose(); deleteTodo() }}>Delete</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ComponentModalConfirmDelete