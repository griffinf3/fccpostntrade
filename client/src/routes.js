import Home from './components/Home.jsx';
import SettingsPage from './containers/SettingsPage.jsx';
import PasswordPage from './containers/PasswordPage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import ABPage from './components/ABPage.jsx';
import MBPage from './components/MBPage.jsx';
import Help from './components/Help.jsx';
import SearchPage from './components/SearchPage.jsx';
import SignLog from './components/SignLog.jsx';
import Auth from './modules/Auth';
import Parent from './components/Parent.jsx';

const routes = {
  // base component (wrapper for the whole application).
  component: Parent,
  childRoutes: [
    {
      path: '/',
      component: Home
    },
      
    {
      path: '/search',
      component: SearchPage
    },

    {
      path: '/help',
      component: Help
    },

    {
      path: '/login', 
      component: LoginPage
    },
      
    {
      path: '/settings', 
      component: SettingsPage
    },
      
    {
      path: '/password', 
      component: PasswordPage
    },
      
    {
      path: '/profile', 
      component: SettingsPage
    },
      
      {
      path: '/allbooks', 
      component: ABPage
    },
      
      {
      path: '/mybooks', 
      component: MBPage
    }, 

    {
      path: '/signup',
      component: SignUpPage
    },
      
    {
      path: '/signlog',
      component: SignLog
    },
      
    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();
        // change the current URL to /
        replace('/');
      }
    }
  ]
};

export default routes;
