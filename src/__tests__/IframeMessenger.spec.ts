import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { IframeMessenger } from '../IframeMessenger';
import { OriginMismatchError } from '../OriginMismatchError';

type TestSuccessResponse = {
  kind: 'test';
  value: string;
};

type TestErrorResponse = {
  kind: 'error';
  message: string;
};

type TestResponse = TestSuccessResponse | TestErrorResponse;

describe('IframeMessenger', () => {
  let messenger: IframeMessenger<TestResponse>;
  let errorFunc: Mock;

  beforeEach(() => {
    errorFunc = vi.fn();
    messenger = new IframeMessenger(errorFunc);
  });

  afterEach(() => {
    messenger.close();
  });

  it('should open an iframe with correct URL', async () => {
    const url = 'https://example.com';
    await messenger.open({ url });

    const iframe = document.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.src).toBe(url + '/');
  });

  it('should open an iframe with default dimensions (100%)', async () => {
    const url = 'https://example.com';
    await messenger.open({ url });

    const wrapper = document.querySelector('div[style*="width: 100%"]') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper?.style.width).toBe('100%');
    expect(wrapper?.style.height).toBe('100%');
  });

  it('should open an iframe with custom dimensions', async () => {
    const url = 'https://example.com';
    const width = '800px';
    const height = '600px';
    await messenger.open({ url, width, height });

    const wrapper = document.querySelector(`div[style*="width: ${width}"]`) as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper?.style.width).toBe(width);
    expect(wrapper?.style.height).toBe(height);
  });

  it('should open an iframe with default dimensions and position', async () => {
    const url = 'https://example.com';
    await messenger.open({ url });

    const wrapper = document.querySelector('div[style*="width: 100%"]') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper?.style.width).toBe('100%');
    expect(wrapper?.style.height).toBe('100%');
    expect(wrapper?.style.top).toBe('0');
  });

  it('should open an iframe with custom dimensions and position', async () => {
    const url = 'https://example.com';
    const width = '800px';
    const height = '600px';
    const top = '30px';
    await messenger.open({ url, width, height, top });

    const wrapper = document.querySelector(`div[style*="width: ${width}"]`) as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper?.style.width).toBe(width);
    expect(wrapper?.style.height).toBe(height);
    expect(wrapper?.style.top).toBe(top);
  });

  it('should handle origin mismatch error', () => {
    const targetUrl = new URL('https://example.com');
    messenger.setupEventHandler(targetUrl);

    const event = new MessageEvent('message', {
      origin: 'https://malicious.com',
      data: { kind: 'test', value: 'test-value' } satisfies TestSuccessResponse,
    });

    window.dispatchEvent(event);

    expect(errorFunc).toHaveBeenCalledWith(expect.any(OriginMismatchError));
  });

  it('should handle messages with registered handlers', () => {
    const targetUrl = new URL('https://example.com');
    const handler = vi.fn();
    const testData: TestSuccessResponse = {
      kind: 'test',
      value: 'test-value',
    };

    messenger.on('test', handler);
    messenger.setupEventHandler(targetUrl);

    const event = new MessageEvent('message', {
      origin: 'https://example.com',
      data: testData,
    });

    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(testData);
  });

  it('should clean up resources on close', async () => {
    const url = 'https://example.com';
    await messenger.open({ url });

    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    messenger.close();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });

  it('should handle type-safe message handlers', () => {
    // Test success message handler
    messenger.on('test', (data) => {
      expect(data.value).toBeDefined();
    });

    // Test error message handler
    messenger.on('error', (data) => {
      expect(data.message).toBeDefined();
    });

    // Test discriminated union handler
    const handler = (data: TestResponse) => {
      if (data.kind === 'test') {
        expect(data.value).toBeDefined();
      } else {
        expect(data.message).toBeDefined();
      }
    };

    messenger.on('test', handler);
    messenger.on('error', handler);
  });
});
