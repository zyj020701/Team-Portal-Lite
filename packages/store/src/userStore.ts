import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 用户状态接口 */
interface UserState {
  /** 当前用户名，未登录时为 null */
  username: string | null;
  /** 是否已登录 */
  isLoggedIn: boolean;
  /** 登录，设置用户名并标记为已登录 */
  login: (username: string) => void;
  /** 登出，清除用户名并标记为未登录 */
  logout: () => void;
}

/**
 * 用户全局状态 Store
 * 使用 Zustand 管理当前登录用户信息
 * 使用 persist 中间件将登录状态持久化到 localStorage，刷新页面后保持登录
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      isLoggedIn: false,
      login: (username: string) =>
        set({
          username,
          isLoggedIn: true,
        }),
      logout: () =>
        set({
          username: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'team-portal-user',
    },
  ),
);