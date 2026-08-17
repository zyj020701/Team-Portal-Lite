import { test, expect } from '@playwright/test';

test.describe('冒烟测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('首页能正常打开，标题正确', async ({ page }) => {
    // 验证页面标题（layout.tsx 中 title 为 "Team Portal Lite"）
    await expect(page).toHaveTitle(/Team Portal Lite/);
  });

  test('公告卡片区域可见', async ({ page }) => {
    // 公告 section 有 h2 标题 "公告"
    const announcementSection = page.getByRole('heading', { name: '公告' }).locator('..');
    await expect(announcementSection).toBeVisible();

    // 等待公告卡片加载完成（mock 数据有 3 条）
    const announcementCards = page.locator('[class*="rounded-lg border"]');
    await expect(announcementCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('待办列表区域可见', async ({ page }) => {
    // 待办 section 有 h2 标题 "待办"
    const todoSection = page.getByRole('heading', { name: '待办' }).locator('..');
    await expect(todoSection).toBeVisible();

    // 等待待办项加载完成
    const todoItems = page.getByRole('checkbox');
    await expect(todoItems.first()).toBeVisible({ timeout: 5000 });
  });

  test('筛选标签栏可见', async ({ page }) => {
    // FilterTabs 组件有 role="tablist"
    const tabList = page.getByRole('tablist');
    await expect(tabList).toBeVisible();

    // 验证三个筛选标签都存在
    await expect(page.getByRole('tab', { name: '全部' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '未完成' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '已完成' })).toBeVisible();
  });

  test('页面头部显示登录按钮', async ({ page }) => {
    // 未登录状态显示"登录"按钮
    const loginButton = page.getByRole('button', { name: '登录' });
    await expect(loginButton).toBeVisible();
  });
});