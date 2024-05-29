// rounting info
import { NavigationItem } from '../interfaces/navigation-item.interface';
export const sidenavRouteInfo: NavigationItem[] = [
  // CORPORATION
  {
    type: 'subheading',
    label: 'CORPORATION',
    children: [
      {
        type: 'link',
        label: 'Company List',
        route: '/companies',
        icon: 'business',
        isNsAdmin: true,
      },
      {
        type: 'link',
        label: 'Admin List',
        route: '/admins',
        icon: 'groups',
        isNsAdmin: true,
      },
    ],
  },
  // Holiday Management
  {
    type: 'subheading',
    label: 'HOLIDAY MANAGEMENT',
    children: [
      {
        type: 'link',
        label: 'Country List',
        route: '/countries',
        icon: 'location_on',
        isNsAdmin: true,
      },
    ],
  },
];
