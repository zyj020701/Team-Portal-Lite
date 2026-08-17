import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  describe('正常输入', () => {
    it('合并多个字符串类名', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('合并对象语法（条件类名）', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });

    it('合并数组语法', () => {
      expect(cn(['a', 'b'], 'c')).toBe('a b c');
    });
  });

  describe('边界输入', () => {
    it('空参数返回空字符串', () => {
      expect(cn()).toBe('');
    });

    it('过滤掉 false、null、undefined', () => {
      expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
    });

    it('所有条件为 false 时返回空字符串', () => {
      expect(cn({ a: false, b: false })).toBe('');
    });
  });

  describe('Tailwind 合并（twMerge）', () => {
    it('冲突的 Tailwind 类以后者为准', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('冲突的颜色类以后者为准', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('不冲突的类同时保留', () => {
      expect(cn('p-2', 'm-4')).toBe('p-2 m-4');
    });
  });
});