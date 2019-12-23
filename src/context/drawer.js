import React from "react";
import { Drawer } from "antd";
import useDialogControls from "../hooks/useDialogControls";

let DrawerDialogContext = React.createContext();

function DrawerDialogProvider({ children }) {
  const [
    showDialog,
    openDialog,
    closeDialog,
    dialogContent,
    width,
    props
  ] = useDialogControls(false);

  const value = { openDialog, closeDialog, isDialogOpen: showDialog };

  return (
    <DrawerDialogContext.Provider value={value}>
      {children}
      <Drawer
        placement="right"
        closable={false}
        onClose={closeDialog}
        visible={showDialog}
        className="Dialog"
        destroyOnClose={true}
        width={width}
        mask={props.mask !== false}
        maskStyle={props.maskStyle}
      >
        {dialogContent}
      </Drawer>
    </DrawerDialogContext.Provider>
  );
}

const DrawerDialogConsumer = DrawerDialogContext.Consumer;

const useDrawer = () => React.useContext(DrawerDialogContext);

export {
  DrawerDialogContext,
  DrawerDialogProvider,
  DrawerDialogConsumer,
  useDrawer
};
