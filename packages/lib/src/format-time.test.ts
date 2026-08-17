import { describe, it, expect } from 'vitest';
import { formatTime } from './format-time';

describe('formatTime', () => {
  describe('正常输入', () => {
    it('格式化普通日期为 YYYY-MM-DD HH:mm:ss', () => {
      const date = new Date(2024, 0, 15, 9, 30, 45);
      expect(formatTime(date)).toBe('2024-01-15 09:30:45');
    });

    it('格式化下午时间', () => {
      const date = new Date(2024, 5, 1, 14, 5, 9);
      expect(formatTime(date)).toBe('2024-06-01 14:05:09');
    });
  });

  describe('边界输入', () => {
    it('正确处理午夜边界 00:00:00', () => {
      const date = new Date(2024, 0, 1, 0, 0, 0);
      expect(formatTime(date)).toBe('2024-01-01 00:00:00');
    });

    it('正确处理月末 23:59:59', () => {
      const date = new Date(2024, 0, 31, 23, 59, 59);
      expect(formatTime(date)).toBe('2024-01-31 23:59:59');
    });

    it('正确处理跨年（12月31日）', () => {
      const date = new Date(2024, 11, 31, 23, 59, 59);
      expect(formatTime(date)).toBe('2024-12-31 23:59:59');
    });

    it('正确处理闰年2月29日', () => {
      const date = new Date(2024, 1, 29, 12, 0, 0);
      expect(formatTime(date)).toBe('2024-02-29 12:00:00');
    });

    it('正确处理跨月（某月1日）', () => {
      const date = new Date(2024, 2, 1, 0, 0, 0);
      expect(formatTime(date)).toBe('2024-03-01 00:00:00');
    });
  });

  describe('异常输入', () => {
    it('对 Invalid Date 返回包含 NaN 的字符串（反映原生 Date 行为）', () => {
      const invalid = new Date('not-a-date');
      const result = formatTime(invalid);
      expect(result).toContain('NaN');
    });
  });
});