import { VStack, Text, Input, Button } from "@chakra-ui/react";
import { SetStateAction, useState } from "react";
import apiRequestCreateProfile from "../../apiRequests/POST/apiRequestCreateAccount";
import toast from "react-hot-toast";

const ComponentCreateAccountCardContent = ({
  setCreateAccount,
}: {
  setCreateAccount: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [userName, setUserName] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [userPassword, setUserPassword] = useState<string | undefined>();

  const createAccountHandler = async () => {
    if (
      userName !== undefined &&
      userEmail !== undefined &&
      userPassword !== undefined
    ) {
      setUserName(userName.trim().toLocaleLowerCase());
      setUserEmail(userEmail.trim().toLocaleLowerCase());

      const apiResponse = await apiRequestCreateProfile(
        userName,
        userEmail,
        userPassword
      );
      // console.log(apiResponse);
      if (typeof apiResponse === "string") {
        toast.error(apiResponse);
      } else {
        toast.success("account created");
        setCreateAccount(false);
      }
    } else {
      toast.error("please fill out the required information");
    }
  };

  return (
    <VStack w="100%">
      <Text mb="4" >Create Account</Text>
      <VStack w="100%" mb="4" spacing="4">
        <Input placeholder="Username" onChange={(event) => setUserName(event.target.value)} />
        <Input placeholder="Email" onChange={(event) => setUserEmail(event.target.value)} />
        <Input placeholder="Password" type="password" onChange={(event) => setUserPassword(event.target.value)} />
      </VStack>
      <VStack spacing="8">
        <Button onClick={createAccountHandler}>Create Account</Button>
        <Button onClick={() => setCreateAccount(false)}>I have an account</Button>
      </VStack>
    </VStack>
  );
};

export default ComponentCreateAccountCardContent;
