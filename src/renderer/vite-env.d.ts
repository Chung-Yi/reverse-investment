/// <reference types="vite/client" />

import type { DesktopBridge } from "../shared/contracts/desktop";

declare global {
  interface Window {
    desktop?: DesktopBridge;
  }
}

export {};
