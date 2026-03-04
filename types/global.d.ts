/* Meta Pixel (Facebook) global function */
interface Window {
  fbq?: (...args: unknown[]) => void;
}
