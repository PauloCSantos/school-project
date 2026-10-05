export type NavItem = {
  label: string;
  path: string;
  icon?: string;
  action?: 'openRegisterUser' | string;
  children?: NavItem[];
};
