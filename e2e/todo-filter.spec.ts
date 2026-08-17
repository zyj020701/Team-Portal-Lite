import { test, expect } from '@playwright/test';

test.describe('待办筛选与交互 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // 等待待办列表加载完成（等待第一个 checkbox 出现）
    await expect(page.getByRole('checkbox').first()).toBeVisible({ timeout: 15000 });
  });

  test('点击"未完成"筛选标签，URL 中出现 ?filter=active', async ({ page }) => {
    // 找到"未完成"标签并点击
    const activeTab = page.getByRole('tab', { name: '未完成' });
    await activeTab.click();

    // 验证 URL 中包含 filter=active（nuqs 状态）
    await expect(page).toHaveURL(/filter=active/);

    // 验证"未完成"标签被选中
    await expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  test('筛选为"未完成"后，列表中不显示已完成的待办项', async ({ page }) => {
    // 先记录初始待办项数量
    const initialItems = page.getByRole('listitem');
    const initialCount = await initialItems.count();

    // 点击"未完成"筛选
    await page.getByRole('tab', { name: '未完成' }).click();
    await expect(page).toHaveURL(/filter=active/);

    // 等待列表更新
    await page.waitForTimeout(500);

    // 验证所有可见的待办项都没有被勾选（即都是未完成的）
    // Radix Checkbox 渲染为 button[role="checkbox"]，不是 input[type="checkbox"]
    const visibleCheckboxes = page.getByRole('listitem').locator('[role="checkbox"]');
    const count = await visibleCheckboxes.count();
    for (let i = 0; i < count; i++) {
      const checkbox = visibleCheckboxes.nth(i);
      await expect(checkbox).toHaveAttribute('aria-checked', 'false');
    }

    // 筛选后的数量应该小于等于初始数量
    const filteredCount = await page.getByRole('listitem').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('刷新页面后，筛选状态保持不变', async ({ page }) => {
    // 点击"未完成"筛选
    await page.getByRole('tab', { name: '未完成' }).click();
    await expect(page).toHaveURL(/filter=active/);

    // 刷新页面
    await page.reload();

    // 等待页面加载完成
    await expect(page.getByRole('checkbox').first()).toBeVisible({ timeout: 15000 });

    // 验证 URL 中仍然包含 filter=active
    await expect(page).toHaveURL(/filter=active/);

    // 验证"未完成"标签仍然被选中
    const activeTab = page.getByRole('tab', { name: '未完成' });
    await expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  test('点击待办项的 Checkbox，完成状态切换', async ({ page }) => {
    // beforeEach 已等待 checkbox 可见，直接获取第一个
    const firstCheckbox = page.getByRole('checkbox').first();

    // 记录初始状态
    const initiallyChecked =
      (await firstCheckbox.getAttribute('aria-checked')) === 'true';

    // 点击 checkbox
    await firstCheckbox.click();

    // 验证状态已切换
    if (initiallyChecked) {
      await expect(firstCheckbox).toHaveAttribute('aria-checked', 'false');
    } else {
      await expect(firstCheckbox).toHaveAttribute('aria-checked', 'true');
    }
  });

  test('三个筛选标签之间切换正常', async ({ page }) => {
    // 切换到"未完成"
    const activeTab = page.getByRole('tab', { name: '未完成' });
    await activeTab.click();
    await expect(page).toHaveURL(/filter=active/);
    await expect(activeTab).toHaveAttribute('aria-selected', 'true');

    // 切换到"已完成"
    const completedTab = page.getByRole('tab', { name: '已完成' });
    await completedTab.click();
    await expect(page).toHaveURL(/filter=completed/);
    await expect(completedTab).toHaveAttribute('aria-selected', 'true');

    // 切换回"全部"（"all" 是默认值，nuqs 可能清除 URL 参数）
    const allTab = page.getByRole('tab', { name: '全部' });
    await allTab.click();
    // 验证"全部"标签被选中（URL 可能是 / 或 /?filter=all）
    await expect(allTab).toHaveAttribute('aria-selected', 'true');
  });
});