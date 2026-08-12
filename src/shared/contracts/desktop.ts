export interface DesktopInfo {
  platform: NodeJS.Platform;
  versions: {
    electron: string;
    chrome: string;
  };
}

export interface DesktopBridge {
  getInfo(): Promise<DesktopInfo>;
}
