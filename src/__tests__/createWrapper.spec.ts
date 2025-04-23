import { describe, it, expect } from 'vitest';
import { createWrapper } from '../createWrapper';

describe('createWrapper', () => {
  it('should create a wrapper with correct styles', () => {
    const wrapper = createWrapper({ width: '50%', height: '50%', top: '10px' });

    expect(wrapper).toBeInstanceOf(HTMLDivElement);
    expect(wrapper.style.position).toBe('relative');
    expect(wrapper.style.width).toBe('50%');
    expect(wrapper.style.height).toBe('50%');
    expect(wrapper.style.top).toBe('10px');
  });

  it('should handle different width, height, and top values', () => {
    const wrapper = createWrapper({ width: '100%', height: '200px', top: '0' });

    expect(wrapper.style.width).toBe('100%');
    expect(wrapper.style.height).toBe('200px');
    expect(wrapper.style.top).toBe('0px');
  });
});