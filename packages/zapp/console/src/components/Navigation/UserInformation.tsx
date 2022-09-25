import * as React from 'react';
import { useFlyteApi } from '@flyteconsole/flyte-api';
import { Link, makeStyles, Theme } from '@material-ui/core';
import { WaitForData } from 'components/common/WaitForData';
import { useUserProfile } from 'components/hooks/useUserProfile';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';
import t from './strings';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    color: theme.palette.common.white,
  },
}));

const LoginLink = (props: { loginUrl: string }) => {
  return (
    <Link href={props.loginUrl} color="inherit">
      {t('login')}
    </Link>
  );
};

/** Displays user info if logged in, or a login link otherwise. */
export const UserInformation: React.FC<{}> = () => {
  const style = useStyles();
  const profile = useUserProfile();
  const apiContext = useFlyteApi();

  const [googleIdToken, setGoogleIdToken] = useState(localStorage.getItem('googleIdToken'));

  const handleLogin = async (credentialResponse) => {
    console.log(credentialResponse);
    const googleIdToken = credentialResponse.credential;
    setGoogleIdToken(googleIdToken);
    localStorage.setItem('googleIdToken', googleIdToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('googleIdToken');
    setGoogleIdToken(null);
  };

  const handleFailure = async () => {
    console.log('Login Failed');
  };

  const googleAuth = true;
  return (
    <div>
      {googleAuth ? (
        <div>
          {googleIdToken ? (
            <div className={style.container}>
              <Link onClick={handleLogout} color="inherit">
                Logout
              </Link>
            </div>
          ) : (
            <GoogleOAuthProvider clientId="509361566581-oetjtq9ge6s4jn5tfkvj7o6ms5m591mo.apps.googleusercontent.com">
              <GoogleLogin onSuccess={handleLogin} onError={handleFailure} />
            </GoogleOAuthProvider>
          )}
        </div>
      ) : (
        <WaitForData spinnerVariant="none" {...profile}>
          <div className={style.container}>
            {!profile.value ? (
              <LoginLink loginUrl={apiContext.getLoginUrl()} />
            ) : !profile.value.preferredUsername || profile.value.preferredUsername === '' ? (
              profile.value.name
            ) : (
              profile.value.preferredUsername
            )}
          </div>
        </WaitForData>
      )}
    </div>
  );
};
