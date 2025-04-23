import { describe, it, expect } from 'vitest';
import { createContainer } from '../createContainer';

describe('createContainer', () => {
  it('should create a container with correct styles when width and height are 100%', () => {
    const container = createContainer({ width: '100%', height: '100%' });

    expect(container).toBeInstanceOf(HTMLDivElement);
    expect(container.style.position).toBe('fixed');
    expect(container.style.top).toBe('0px');
    expect(container.style.left).toBe('0px');
    expect(container.style.width).toBe('100%');
    expect(container.style.height).toBe('100%');
    expect(container.style.backgroundColor).toBe('white');
    expect(container.style.zIndex).toBe('2147483646');
    expect(container.style.display).toBe('flex');
    expect(container.style.justifyContent).toBe('center');
    expect(container.style.alignItems).toBe('center');
  });

  it('should create a container with semi-transparent background when width or height is not 100%', () => {
    const container = createContainer({ width: '50%', height: '50%' });

    expect(container.style.backgroundColor).toBe('rgba(0, 0, 0, 0.5)');
  });
});