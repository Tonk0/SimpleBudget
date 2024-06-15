import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import loginAction from './actions/login.action';
import Main from './pages/Main';
import Analytics from './pages/Analytics';
import CreateAccount from './pages/CreateAccount';
import createAccountAction from './actions/createAccount.action';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    action: loginAction,
  },
  {
    path: '/main',
    element: <Main />,
  },
  {
    path: '/analytics',
    element: <Analytics />,
  },
  {
    path: '/createBudget',
    element: <CreateAccount />,
    action: createAccountAction,
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
