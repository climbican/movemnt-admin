import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Routines',
    icon: 'layout-outline',
    children: [
      {
        title: 'List',
        link: '/pages/routines/list',
      },
      {
        title: 'Add',
        link: '/pages/routines/add',
      },
    ],
  },
  {
    title: 'Workouts',
    icon: 'layout-outline',
    children: [
      {
        title: 'List',
        link: '/pages/workouts/list',
      },
      {
        title: 'Add',
        link: '/pages/workouts/add',
      },
    ],
  },
  {
    title: 'Equipment',
    icon: 'layout-outline',
    children: [
      {
        title: 'List',
        link: '/pages/equipment/list',
      },
      {
        title: 'Add',
        link: '/pages/equipment/add',
      },
    ],
  },
  {
    title: 'Groups & Users',
    group: true,
  },
  {
    title: 'Users',
    icon: 'person-outline',
    children: [
      {
        title: 'User List',
        link: '/pages/users/list',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
