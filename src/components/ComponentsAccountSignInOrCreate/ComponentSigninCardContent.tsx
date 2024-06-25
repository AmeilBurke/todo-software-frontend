import { Text, Button, Input, VStack } from "@chakra-ui/react";
import { SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import IsJWTTokenValid from "../../apiRequests/GET/IsJWTTokenValid";
import apiRequestSignin from "../../apiRequests/POST/apiRequestSignIn";
import { Account } from "../../types/TypeIndex";
import { SaveJWTToLocalStorage } from "../../utils/utilIndex";
import GetFullProfileInformation from "../../apiRequests/GET/GetFullProfileInformation";

const ComponentSigninCardContent = ({
  setJwtToken,
  setAccountInfo,
  setCreateAccount,
}: {
  setJwtToken: React.Dispatch<SetStateAction<{ access_token: string } | string>
  >;
  jwtToken: { access_token: string } | string;
  setAccountInfo: React.Dispatch<SetStateAction<Account | undefined>>;
  setCreateAccount: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [userGivenEmail, setUserGivenEmail] = useState<string>("");
  const [userGivenPassword, setUserGivenPassword] = useState<string>("");

  const handleUserEmailInput = (email: string) => {
    setUserGivenEmail(email);
  };

  const handleUserPasswordInput = (password: string) => {
    setUserGivenPassword(password);
  };

  const getJWTTokenFromBackend = async (email: string, password: string) => {
    const jwtToken = await apiRequestSignin(email, password);
    if (typeof jwtToken === "string") {
      toast.error("please check your email & password then try again");
    } else {
      setJwtToken(jwtToken);
      SaveJWTToLocalStorage(jwtToken.access_token);

      const isJWTTokenValidResponse = await IsJWTTokenValid(jwtToken.access_token);

      if (typeof isJWTTokenValidResponse !== "string") {
        const fullProfileInfoinformationResponse =
          await GetFullProfileInformation(isJWTTokenValidResponse.sub);
        if (typeof fullProfileInfoinformationResponse !== "string") {
          setAccountInfo(fullProfileInfoinformationResponse);
          toast.success(`welcome ${fullProfileInfoinformationResponse.account_username}`);
          SaveJWTToLocalStorage(jwtToken.access_token);
        }
      }
    }
  };

  return (
    <VStack w="100%" >
      <Text mb="4" >Sign In</Text>
      <VStack w="100%" mb="4" spacing="4" >
        <Input placeholder="Email" onChange={(event) => handleUserEmailInput(event.target.value)} />
        <Input placeholder="Password" type="password" onChange={(event) => handleUserPasswordInput(event.target.value)} />
        <VStack w="full" spacing="4">
          <Button w={["full"]} onClick={() => getJWTTokenFromBackend(userGivenEmail, userGivenPassword)} colorScheme="green" >Sign In</Button>
          <Button w={["full"]} onClick={() => setCreateAccount(true)}>I don't have an account</Button>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default ComponentSigninCardContent;
