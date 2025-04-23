/** Arguments for creating a container element */
export type CreateContainerArgs = {
  /** Width of the iframe */
  width: string;
  /** Height of the iframe */
  height: string;
};

/**
 * Creates a container element for the iframe
 * @param args - Arguments for creating the container
 * @returns The created container element
 */
export const createContainer = ({ width, height }: CreateContainerArgs): HTMLDivElement => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.backgroundColor = width === '100%' && height === '100%' ? 'white' : 'rgba(0, 0, 0, 0.5)';
  container.style.zIndex = '2147483646';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  return container;
}