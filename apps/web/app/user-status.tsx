'use client';

import { useUserStore } from '@team-portal-lite/store';

export function UserStatus() {
  const { username, isLoggedIn, login, logout } = useUserStore();

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <p className="text-lg">
        当前用户：
        <span className="font-semibold">
          {isLoggedIn ? username : '未登录'}
        </span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => login('测试用户')}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          切换用户
        </button>
        <button
          type="button"
          onClick={() => logout()}
          className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          登出
        </button>
      </div>
    </div>
  );
}