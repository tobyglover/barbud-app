import { StackNavigator } from 'react-navigation';

import WelcomeScreen from './WelcomeScreen';
import SignUpContainer from '../../containers/signup/SignUpContainer';
import SignUpDisclaimer from './signup/SignUpDisclaimer';
import LogInScreenContainer from '../../containers/LogInScreenContainer';

export const SignedOutNavigator = StackNavigator(
  {
    WelcomeScreen: {screen: WelcomeScreen},
    SignUpDisclaimer: {screen: SignUpDisclaimer},
    SignUp: {screen: SignUpContainer},
    LogInScreen: {screen: LogInScreenContainer}
  },
  {
    headerMode: 'none',
});
