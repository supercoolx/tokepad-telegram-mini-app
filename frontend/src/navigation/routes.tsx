import type { ComponentType, JSX } from 'react';

import Index from '@/pages/Index';
import Ref from '@/pages/Ref';
import Task from '@/pages/Tasks';
import Boost from '@/pages/Boost';
import Wallet from '@/pages/Wallet';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: Index },
  { path: '/ref', Component: Ref },
  { path: '/task', Component: Task },
  { path: '/boost', Component: Boost },
  { path: '/wallet', Component: Wallet },
];
