import type { RouteObject } from 'react-router-dom';
import LayoutBuyer from '../../components/LayoutBuyer';
import Home from './Home';
import Apps from './Apps';
import Purchases from './Purchases';
import Guide from './Guide';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export const buyerRoutes: RouteObject[] = [
  {
    path: '/buyer',
    element: <LayoutBuyer />,
    children: [
      {
        path: 'home',
        element: <Home />,
        handle: { label: 'Inicio', icon: <HomeIcon />, sidebar: true },
      },
      {
        path: 'apps',
        element: <Apps />,
        handle: { label: 'Explorar Apps', icon: <AppsIcon />, sidebar: true },
      },
      {
        path: 'purchases',
        element: <Purchases />,
        handle: { label: 'Mis Compras & Reviews', icon: <ShoppingBagIcon />, sidebar: true },
      },
      {
        path: 'guide',
        element: <Guide />,
        handle: { label: 'Guía del Usuario', icon: <MenuBookIcon />, sidebar: true },
      },
    ],
  },
];

export default buyerRoutes;
