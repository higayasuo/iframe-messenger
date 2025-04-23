import { describe, it, expect, vi } from 'vitest';
import { createCloseButton } from '../createCloseButton';

describe('createCloseButton', () => {
  it('should create a close button with correct styles', () => {
    const onClick = vi.fn();
    const button = createCloseButton({ onClick });

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.textContent).toBe('×');
    expect(button.style.position).toBe('fixed');
    expect(button.style.top).toBe('16px');
    expect(button.style.right).toBe('16px');
    expect(button.style.fontSize).toBe('32px');
    expect(button.style.width).toBe('48px');
    expect(button.style.height).toBe('48px');
    expect(button.style.borderWidth).toBe('0px');
    expect(button.style.borderStyle).toBe('none');
    expect(button.style.borderRadius).toBe('50%');
    expect(button.style.background).toBe('white');
    expect(['#333', 'rgb(51, 51, 51)']).toContain(button.style.color);
    expect(button.style.cursor).toBe('pointer');
    expect(button.style.display).toBe('flex');
    expect(button.style.alignItems).toBe('center');
    expect(button.style.justifyContent).toBe('center');
    expect(button.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.2)');
    expect(button.style.zIndex).toBe('2147483647');
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    const button = createCloseButton({ onClick });

    button.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});