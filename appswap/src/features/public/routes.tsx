import type { RouteObject } from 'react-router-dom';
import LayoutPublic from '../../components/LayoutPublic';
import LandingHome from './LandingHome';
import ForBuyers from './ForBuyers';
import ForVendors from './ForVendors';
import Contact from './Contact';
import BuyerGuide from './BuyerGuide';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPublic />,
    children: [
      {
        index: true,
        element: <LandingHome />,
      },
      {
        path: 'for-buyers',
        element: <ForBuyers />,
      },
      {
        path: 'for-vendors',
        element: <ForVendors />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'buyer-guide',
        element: <BuyerGuide />,
      },
    ],
  },
];

export default publicRoutes;
