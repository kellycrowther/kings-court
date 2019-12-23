import React from "react";
import { CoverScreenProvider } from "./cover";
import { DrawerDialogProvider } from "./drawer";

function DialogProviders({ children }) {
  return (
    <CoverScreenProvider>
      <DrawerDialogProvider>{children}</DrawerDialogProvider>
    </CoverScreenProvider>
  );
}

export { DialogProviders };
