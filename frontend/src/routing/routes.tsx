import { createBrowserRouter } from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';

const router = createBrowserRouter([
  {
    path: '*',
    element: <AnimatedRoutes />,
  },
]);

export default router;
