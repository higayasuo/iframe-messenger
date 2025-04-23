/** Arguments for creating a close button element */
export type CreateCloseButtonArgs = {
  /** Function to be called when the button is clicked */
  onClick: () => void;
};

/**
 * Creates a close button element
 * @param args - Arguments for creating the close button
 * @returns The created close button element
 */
export const createCloseButton = ({ onClick }: CreateCloseButtonArgs): HTMLButtonElement => {
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'fixed';
  closeButton.style.top = '16px';
  closeButton.style.right = '16px';
  closeButton.style.fontSize = '32px';
  closeButton.style.width = '48px';
  closeButton.style.height = '48px';
  closeButton.style.borderWidth = '0';
  closeButton.style.borderStyle = 'none';
  closeButton.style.borderRadius = '50%';
  closeButton.style.background = 'white';
  closeButton.style.color = '#333';
  closeButton.style.cursor = 'pointer';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  closeButton.style.zIndex = '2147483647';
  closeButton.onclick = onClick;
  return closeButton;
}