# iframe-messenger

This package enables the use of iframe and postMessage interactions in a type-safe manner.

## Features

- Type-safe message handling with TypeScript
- Modal-like iframe overlay with a close button
- Origin validation for security
- Event-based communication using postMessage
- Clean error handling
- Fully typed message handlers

## Installation

```bash
npm install @higayasuo/iframe-messenger
```

## Usage

```typescript
import { IframeMessenger } from '@higayasuo/iframe-messenger';

// Define your message types
type SuccessMessage = {
  kind: 'success';
  data: string;
};

type ErrorMessage = {
  kind: 'error';
  message: string;
};

// Union type of all possible messages
type Message = SuccessMessage | ErrorMessage;

// Create an instance
const messenger = new IframeMessenger<Message>();

// Register message handlers
messenger.on('success', (message) => {
  // TypeScript knows this is a SuccessMessage
  console.log(message.data);
});

messenger.on('error', (message) => {
  // TypeScript knows this is an ErrorMessage
  console.log(message.message);
});

// Open the iframe
await messenger.open({ url: 'https://example.com' });

// Close the iframe when done
messenger.close();
```

## API

### `IframeMessenger<T>`

Generic class where `T` represents your message type. `T` must include a `kind` property for message type discrimination.

#### Constructor

```typescript
constructor(errorFunc: (error: Error) => void = console.error)
```

- `errorFunc`: Optional error handler function. Defaults to `console.error`.

#### Methods

##### `on<K extends T['kind']>(kind: K, handler: (response: Extract<T, { kind: K }>) => void): this`

Registers a handler for a specific message kind.

- `kind`: The type of message to handle
- `handler`: Function to handle messages of the specified kind
- Returns: The IframeMessenger instance for chaining

##### `open(options: { url: string }): Promise<void>`

Opens an iframe with the specified URL in a modal-like overlay.

- `url`: The URL to load in the iframe

##### `close(): Promise<void>`

Closes the iframe and removes it from the DOM.

## Security

The package includes built-in origin validation to prevent cross-origin attacks. Messages are only processed if they come from the same origin as the iframe URL.

## Styling

The iframe is displayed in a modal-like overlay with:
- Semi-transparent background
- Centered positioning
- Close button in the top-right corner
- Responsive dimensions (400px × 600px by default)
- Clean, modern styling with rounded corners

## Error Handling

Errors are handled gracefully and passed to the provided error handler function. The package includes built-in handling for:
- Origin mismatch errors
- Invalid message format errors

## TypeScript Support

The package is written in TypeScript and provides full type safety for:
- Message handling
- Event type discrimination
- Error handling

## License

MIT
