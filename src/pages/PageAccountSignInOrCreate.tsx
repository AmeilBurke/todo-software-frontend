import { Box, Card, CardBody, Divider, HStack, Heading, Image, VStack } from "@chakra-ui/react";
import { SetStateAction } from "react";
import ComponentCreateAccountCardContent from "../components/ComponentsAccountSignInOrCreate/ComponentCreateAccountCardContent";
import ComponentSigninCardContent from "../components/ComponentsAccountSignInOrCreate/ComponentSigninCardContent";
import { Account } from "../types/TypeIndex";

import signInImg from '../assets/image-signin.jpg';

const PageAccountSignInOrCreate = ({
  setJwtToken,
  jwtToken,
  setAccountInfo,
  setCreateAccount,
  createAccount,
}: {
  setJwtToken: React.Dispatch<SetStateAction<{ access_token: string } | string>>;
  jwtToken: { access_token: string } | string;
  setAccountInfo: React.Dispatch<SetStateAction<Account | undefined>>;
  accountInfo: Account | undefined;
  setUserHasFailedLogin: React.Dispatch<SetStateAction<boolean>>;
  userHasFailedLogin: boolean;
  setCreateAccount: React.Dispatch<SetStateAction<boolean>>;
  createAccount: boolean;
}) => {
  return (
    <HStack position="relative" h="100vh" w="100vw" justifyContent="space-around">
      <Image position="absolute" zIndex="1" h="100%" w="100%" objectFit="cover" filter="auto" brightness="50%" src={signInImg} alt="sign-in image" />
      <Box display={["none", null, null, "block"]} ></Box>
      <Card position="relative" zIndex="2" height="fit-content" width="fit-content" py="8" px="4" rounded="12" bg="white" shadow="2xl">
        <VStack>
          <Heading mb="4">Ahead Today</Heading>
          <Divider />
          <CardBody w="full" mx="16" >
            {createAccount ? (
              <ComponentCreateAccountCardContent
                setCreateAccount={setCreateAccount}
              />
            ) : (
              <ComponentSigninCardContent
                setJwtToken={setJwtToken}
                jwtToken={jwtToken}
                setAccountInfo={setAccountInfo}
                setCreateAccount={setCreateAccount}
              />
            )}
          </CardBody>
        </VStack>
      </Card>
    </HStack>
  );
};

export default PageAccountSignInOrCreate;
