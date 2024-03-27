import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';

import Default from './pages/Default';
import Home from './pages/Home';

import * as routes from './constants/routes';

const router = createBrowserRouter([
  {
    path: routes.DEFAULT,
    element: <Default />,
    children: [{ path: routes.HOME, element: <Home /> }],
  },
  {
    path: '*',
    loader: () => redirect('/'),
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
