/** Arguments for creating an iframe element */
export type CreateIframeArgs = {
  /** URL to load in the iframe */
  url: string;
  /** Width of the iframe */
  width: string;
  /** Height of the iframe */
  height: string;
};

/**
 * Creates an iframe element
 * @param args - Arguments for creating the iframe
 * @returns The created iframe element
 */
export const createIframe = ({ url, width, height }: CreateIframeArgs): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.borderWidth = '0';
  iframe.style.borderStyle = 'none';
  if (width !== '100%' || height !== '100%') {
    iframe.style.borderRadius = '8px';
  }
  iframe.style.backgroundColor = 'white';
  iframe.src = url;
  return iframe;
}