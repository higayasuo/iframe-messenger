import { OriginMismatchError } from './OriginMismatchError';
import { createContainer } from './createContainer';
import { createWrapper } from './createWrapper';
import { createIframe } from './createIframe';
import { createCloseButton } from './createCloseButton';

/** Function type for error handling */
export type ErrorFunc = (error: Error) => void;

/** Options for opening an iframe */
export interface IframeMessengerOpenOptions {
  /** URL to load in the iframe */
  url: string;
  /** Width of the iframe. Defaults to '100%' */
  width?: string;
  /** Height of the iframe. Defaults to '100%' */
  height?: string;
  /** Top position of the iframe. Defaults to '0' */
  top?: string;
}

/**
 * IframeMessenger handles communication between a parent window and its iframe
 * @template T - Message type that must include a 'kind' property for message type discrimination
 */
export class IframeMessenger<T extends { kind: string }> {
  private errorFunc: ErrorFunc;
  private handlers: Partial<Record<T['kind'], (response: T) => void>> = {};
  private iframe?: HTMLIFrameElement;
  private eventHandler?: (event: MessageEvent<T>) => void;

  /**
   * Creates an instance of IframeMessenger
   * @param errorFunc - Function to handle errors, defaults to console.error
   */
  constructor(errorFunc: ErrorFunc = console.error) {
    this.errorFunc = errorFunc;
  }

  /**
   * Registers a handler for a specific message kind
   * @param kind - The type of message to handle
   * @param handler - Function to handle messages of the specified kind
   * @returns The IframeMessenger instance for chaining
   */
  on<K extends T['kind']>(
    kind: K,
    handler: (response: Extract<T, { kind: K }>) => void,
  ): this {
    this.handlers[kind] = handler as (response: T) => void;
    return this;
  }

  /**
   * Handles incoming message events
   * @param event - The message event containing data from the iframe
   */
  handleEvent(event: MessageEvent<T>): void {
    const data = event.data;

    if (this.isValidMessageData(data)) {
      const handler = this.handlers[data.kind as T['kind']];

      if (handler) {
        handler(data);
      } else {
        console.warn(`No handler registered for message kind: ${data.kind}`);
      }
    } else {
      console.warn('Invalid message format:', data);
    }
  }

  /**
   * Validates that the received message data matches the expected format
   * @param data - The message data to validate
   * @returns True if the data is valid, false otherwise
   */
  private isValidMessageData(data: unknown): data is T {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const message = data as { kind?: unknown };
    return 'kind' in data && typeof message.kind === 'string';
  }

  /**
   * Opens an iframe with the specified URL in a modal-like overlay
   * @param options - Options for opening the iframe
   * @throws {WindowOpenError} If the iframe cannot be created
   */
  public async open({ url, width = '100%', height = '100%', top = '0' }: IframeMessengerOpenOptions): Promise<void> {
    const targetUrl = new URL(url);

    this.close();

    this.setupEventHandler(targetUrl);

    const container = createContainer({ width, height });
    const wrapper = createWrapper({ width, height, top });
    this.iframe = createIframe({ url: targetUrl.toString(), width, height });
    const closeButton = createCloseButton({ onClick: () => this.close() });

    wrapper.appendChild(this.iframe);
    container.appendChild(wrapper);
    container.appendChild(closeButton);
    document.body.appendChild(container);
  }

  /**
   * Closes the iframe and removes it from the DOM
   */
  public async close(): Promise<void> {
    if (this.iframe) {
      const container = this.iframe.parentElement?.parentElement;
      if (container && container.parentElement) {
        container.parentElement.removeChild(container);
      }
      delete this.iframe;
    }
    this.removeEventHandler();
  }

  /**
   * Sets up the event handler for postMessage communication
   * @param targetURL - The URL of the iframe for origin validation
   */
  setupEventHandler(targetURL: URL): void {
    this.eventHandler = (event: MessageEvent<T>) => {
      try {
        if (window?.location?.origin === event.origin) {
          return;
        }

        if (event.origin !== targetURL.origin) {
          console.log('event', event);
          throw new OriginMismatchError(targetURL.origin, event.origin);
        }

        this.handleEvent(event);
      } catch (error) {
        const e =
          typeof error === 'string'
            ? new Error(error)
            : error instanceof Error
            ? error
            : new Error(String(error));
        this.handleError(e);
      }
    };
    window.addEventListener('message', this.eventHandler as EventListener);
  }

  /**
   * Removes the event handler for postMessage communication
   */
  removeEventHandler(): void {
    if (this.eventHandler) {
      window.removeEventListener('message', this.eventHandler as EventListener);
      this.eventHandler = undefined;
    }
  }

  /**
   * Handles errors by closing the iframe and calling the error handler
   * @param error - The error to handle
   */
  handleError(error: Error): void {
    this.close();
    this.errorFunc(error);
  }
}
