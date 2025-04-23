/** Arguments for creating a wrapper element */
export type CreateWrapperArgs = {
  /** Width of the wrapper */
  width: string;
  /** Height of the wrapper */
  height: string;
  /** Top position of the wrapper */
  top: string;
};

/**
 * Creates a wrapper element for the iframe
 * @param args - Arguments for creating the wrapper
 * @returns The created wrapper element
 */
export const createWrapper = ({ width, height, top }: CreateWrapperArgs): HTMLDivElement => {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = width;
  wrapper.style.height = height;
  wrapper.style.top = top;
  return wrapper;
}