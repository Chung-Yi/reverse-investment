import { contextBridge, ipcRenderer } from "electron";
import type { DesktopBridge, DesktopInfo } from "../shared/contracts/desktop";

const desktopBridge: DesktopBridge = {
  getInfo: () => ipcRenderer.invoke("desktop:get-info") as Promise<DesktopInfo>,
};

contextBridge.exposeInMainWorld("desktop", desktopBridge);
