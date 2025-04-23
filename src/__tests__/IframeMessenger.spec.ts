import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IframeMessenger } from '../IframeMessenger';
import { createContainer } from '../createContainer';
import { createWrapper } from '../createWrapper';
import { createIframe } from '../createIframe';
import { createCloseButton } from '../createCloseButton';

vi.mock('../createContainer', () => ({
  createContainer: vi.fn().mockReturnValue(document.createElement('div')),
}));

vi.mock('../createWrapper', () => ({
  createWrapper: vi.fn().mockReturnValue(document.createElement('div')),
}));

vi.mock('../createIframe', () => ({
  createIframe: vi.fn().mockReturnValue(document.createElement('iframe')),
}));

vi.mock('../createCloseButton', () => ({
  createCloseButton: vi.fn().mockReturnValue(document.createElement('button')),
}));

describe('IframeMessenger', () => {
  let messenger: IframeMessenger<{ kind: string; data: string }>;
  const mockErrorFunc = vi.fn();

  beforeEach(() => {
    messenger = new IframeMessenger(mockErrorFunc);
    vi.clearAllMocks();
  });

  it('should open an iframe with correct URL', async () => {
    const url = 'https://example.com/';
    await messenger.open({ url });

    expect(createContainer).toHaveBeenCalledWith({ width: '100%', height: '100%' });
    expect(createWrapper).toHaveBeenCalledWith({ width: '100%', height: '100%', top: '0' });
    expect(createIframe).toHaveBeenCalledWith({ url, width: '100%', height: '100%' });
    expect(createCloseButton).toHaveBeenCalled();
  });

  it('should open an iframe with custom dimensions and position', async () => {
    const url = 'https://example.com/';
    const width = '50%';
    const height = '200px';
    const top = '10px';

    await messenger.open({ url, width, height, top });

    expect(createContainer).toHaveBeenCalledWith({ width, height });
    expect(createWrapper).toHaveBeenCalledWith({ width, height, top });
    expect(createIframe).toHaveBeenCalledWith({ url, width, height });
    expect(createCloseButton).toHaveBeenCalled();
  });

  it('should handle origin mismatch error', async () => {
    const url = 'https://example.com/';
    const invalidOrigin = 'https://invalid.com';

    await messenger.open({ url });
    window.dispatchEvent(new MessageEvent('message', {
      origin: invalidOrigin,
      data: { kind: 'test', data: 'test' },
    }));

    expect(mockErrorFunc).toHaveBeenCalled();
  });

  it('should handle messages with registered handlers', async () => {
    const url = 'https://example.com/';
    const mockHandler = vi.fn();
    const message = { kind: 'test', data: 'test' };

    messenger.on('test', mockHandler);
    await messenger.open({ url });

    window.dispatchEvent(new MessageEvent('message', {
      origin: new URL(url).origin,
      data: message,
    }));

    expect(mockHandler).toHaveBeenCalledWith(message);
  });

  it('should clean up resources on close', async () => {
    const url = 'https://example.com/';
    await messenger.open({ url });

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    await messenger.close();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });

  it('should handle type-safe message handlers', async () => {
    const url = 'https://example.com/';
    const mockHandler = vi.fn();
    const message = { kind: 'test', data: 'test' };

    messenger.on('test', mockHandler);
    await messenger.open({ url });

    window.dispatchEvent(new MessageEvent('message', {
      origin: new URL(url).origin,
      data: message,
    }));

    expect(mockHandler).toHaveBeenCalledWith(message);
  });
});
