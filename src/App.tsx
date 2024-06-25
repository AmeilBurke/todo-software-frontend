import { Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { Account } from './types/TypeIndex';
import PageAccountSignInOrCreate from './pages/PageAccountSignInOrCreate';
import PageDashboard from './pages/PageDashboard';
import { CheckLocalStorageForJWT, RemoveJWTFromLocalStorage } from './utils/utilIndex';
import apiRequestGetProfile from './apiRequests/POST/apiRequestGetProfile';
import GetFullProfileInformation from './apiRequests/GET/GetFullProfileInformation';

function App() {
  const [accountInfo, setAccountInfo] = useState<Account | undefined>(undefined);
  const [jwtToken, setJwtToken] = useState<{ access_token: string } | string>("");
  const [userHasFailedLogin, setUserHasFailedLogin] = useState<boolean>(false);
  const [createAccount, setCreateAccount] = useState<boolean>(false);
  const [hasAutoLoginFailed, setHasAutoLoginFailed] = useState<boolean>(false);

  const getAccountInfoFromJwt = async () => {
    const basicProfileInfoResponse = await apiRequestGetProfile();
    if (typeof basicProfileInfoResponse !== 'string') {
      const fullProfileInfoResponse = await GetFullProfileInformation(basicProfileInfoResponse.sub);

      if (typeof fullProfileInfoResponse !== 'string') {
        setAccountInfo(fullProfileInfoResponse);
      }
    } else {
      setHasAutoLoginFailed(true);
    }
  }


  useEffect(() => {
    if (accountInfo === undefined && !hasAutoLoginFailed) {
      const jwtToken = CheckLocalStorageForJWT();
      if (typeof jwtToken === 'boolean') {
        RemoveJWTFromLocalStorage();
      } else {
        getAccountInfoFromJwt();
      }
    }

  }, [accountInfo])


  if (accountInfo !== undefined) {
    return (
      <PageDashboard accountInfo={accountInfo} setAccountInfo={setAccountInfo} />
    )
  }

  return (
    <Box>
      <PageAccountSignInOrCreate
        setJwtToken={setJwtToken}
        jwtToken={jwtToken}
        setAccountInfo={setAccountInfo}
        accountInfo={accountInfo}
        setUserHasFailedLogin={setUserHasFailedLogin}
        userHasFailedLogin={userHasFailedLogin}
        setCreateAccount={setCreateAccount}
        createAccount={createAccount}
      />
    </Box>
  )
}

export default App
