import { describe, it, expect } from 'vitest';
import { createIframe } from '../createIframe';

describe('createIframe', () => {
  it('should create an iframe with correct styles and URL', () => {
    const url = 'https://example.com/';
    const iframe = createIframe({ url, width: '100%', height: '100%' });

    expect(iframe).toBeInstanceOf(HTMLIFrameElement);
    expect(iframe.style.width).toBe('100%');
    expect(iframe.style.height).toBe('100%');
    expect(iframe.style.borderWidth).toBe('0px');
    expect(iframe.style.borderStyle).toBe('none');
    expect(iframe.style.backgroundColor).toBe('white');
    expect(iframe.src).toBe(url);
  });

  it('should not have borderRadius when width and height are 100%', () => {
    const iframe = createIframe({ url: 'https://example.com', width: '100%', height: '100%' });

    expect(iframe.style.borderRadius).toBe('');
  });

  it('should have borderRadius when width or height is not 100%', () => {
    const iframe = createIframe({ url: 'https://example.com', width: '50%', height: '50%' });

    expect(iframe.style.borderRadius).toBe('8px');
  });
});