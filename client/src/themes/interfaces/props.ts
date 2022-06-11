import { ChangeEvent, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Page, PageItem, Post, User } from '../../../../shared';

interface GenericDialogProps {
  open: boolean;
  onClose: (result: 'ok' | 'cancel' | 'dismiss') => void;
  title: string;
  text: string;
  type?: string;
}

interface LoginButtonProps {
  username: string;
  password: string;
  onLoginClick: (event: React.MouseEvent<HTMLButtonElement,MouseEvent>) => void;
  onLogoffClick: (event: React.MouseEvent<HTMLButtonElement,MouseEvent>) => void;
  onOpen: () => void;
  onClose: () => void;
  onUsernameChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  loginOpen: boolean;
  isLoggedIn: boolean;
}

interface MenuItemProps {
  item: PageItem;
  onClick:  (page: PageItem) => void;
  isChild?: boolean;
  menuItems: ReactNode[];
}

interface MenuProps extends RouteComponentProps  {
  serverError: (value: string) => void;
  toggleDrawer: (value : boolean) => void;
  navigateTo: (url: string) => void;
  settings: Map<string, string | undefined>;
  list: ReactNode[];
  drawer: boolean;
  isLoggedIn: boolean;
  loginButton: ReactNode;
}

interface ServerErrorDialogProps {
  open: boolean;
  onClose: () => void;
};

interface ArticleRouteParams {
  slug?: string;
}

interface ArticleProps extends RouteComponentProps<ArticleRouteParams> {
  serverError: (value: string) => void;
  display?: Page;
}


interface BlogRouteParams {
  slug?: string;
}

interface BlogProps extends RouteComponentProps<BlogRouteParams> {
  serverError: (value: string) => void;
  display?: Post
}

interface HomeRouteParams {
  slug?: string;
}

interface HomeProps extends RouteComponentProps<HomeRouteParams> {
  serverError: (value: string) => void;
  list: Post[];
  users: Map<string, User>;
  hasMore: boolean;
  getNext: () => void;
}

export type {
  GenericDialogProps,
  LoginButtonProps,
  MenuItemProps,
  MenuProps,
  ServerErrorDialogProps,
  ArticleProps,
  BlogProps,
  HomeProps
}
