import { Button } from "@chakra-ui/react";
import React from "react";

const ComponentSidebarButton = ({
    buttonText,
    setActivePageId,
    todoPageId,
}: {
    buttonText: string;
    setActivePageId: React.Dispatch<React.SetStateAction<number>>;
    todoPageId: number;
}) => {
    return (

        // figure out how to truncate text & have button full width
        <>
            <Button w="full" pl="4" display="inline-block" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" textAlign="left" onClick={() => setActivePageId(todoPageId)}>
                {buttonText}
            </Button>
        </>
    );
};

export default ComponentSidebarButton;
