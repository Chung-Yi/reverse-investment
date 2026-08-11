import { app, BrowserWindow, ipcMain } from "electron";
import type { DesktopInfo } from "../shared/contracts/desktop";
import { createMainWindow } from "./windows/createMainWindow";

ipcMain.handle("desktop:get-info", (): DesktopInfo => ({
  platform: process.platform,
  versions: {
    electron: process.versions.electron ?? "unknown",
    chrome: process.versions.chrome ?? "unknown",
  },
}));

app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
