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

    // Mock createElement to track iframe creation
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = {
        style: {},
        tagName: tagName.toUpperCase(),
        appendChild: vi.fn(),
      } as unknown as HTMLElement;

      if (tagName === 'iframe') {
        return {
          ...element,
          src: '',
        } as unknown as HTMLIFrameElement;
      }

      return element;
    });

    // Mock appendChild to prevent actual DOM manipulation
    vi.spyOn(document.body, 'appendChild').mockReturnValue(document.body);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    messenger.close();
  });

  it('should open an iframe with correct URL', async () => {
    const url = 'https://example.com';
    await messenger.open({ url });

    const createElementCalls = vi.mocked(document.createElement).mock.calls;
    const iframeCalls = createElementCalls.filter(([tag]) => tag === 'iframe');
    expect(iframeCalls.length).toBe(1);
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
