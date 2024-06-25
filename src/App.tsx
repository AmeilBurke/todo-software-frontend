import { Box } from '@chakra-ui/react'
import { useState } from 'react';
import { Account } from './types/TypeIndex';
import PageAccountSignInOrCreate from './pages/PageAccountSignInOrCreate';
import PageDashboard from './pages/PageDashboard';

function App() {
  const [accountInfo, setAccountInfo] = useState<Account | undefined>(undefined);
  const [jwtToken, setJwtToken] = useState<{ access_token: string } | string>("");
  const [userHasFailedLogin, setUserHasFailedLogin] = useState<boolean>(false);
  const [createAccount, setCreateAccount] = useState<boolean>(false);

  // TODO: add auto login

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
