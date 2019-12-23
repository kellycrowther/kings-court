import React from "react";
import styled from "styled-components";
import { Modal } from "antd";
import useDialogControls from "../hooks/useDialogControls";
import useEscKeyPress from "../hooks/useEscKeyPress";

let CoverScreenContext = React.createContext();

const CoverModalStyle = ComponentName => styled(ComponentName)`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  padding: 0;
  margin: 0;
  &.ant-modal {
    top: 0;
    padding-bottom: 0px;
  }
  .ant-modal-content {
    height: 100%;
  }
  .ant-modal-body {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #f0f2f5;
    background: #fff;
  }
`;

const CoverModel = CoverModalStyle(Modal);

function CoverScreenProvider({ children }) {
  const [
    showCoverScreen,
    openCoverScreen,
    closeCoverScreen,
    coverScreenContent
  ] = useDialogControls(false);

  useEscKeyPress(closeCoverScreen);

  const value = {
    openCoverScreen,
    closeCoverScreen,
    isCoverScreenOpen: showCoverScreen
  };

  return (
    <CoverScreenContext.Provider value={value}>
      {children}
      <CoverModel
        width="100%"
        mask={false}
        footer={false}
        closable
        onCancel={closeCoverScreen}
        visible={showCoverScreen}
        destroyOnClose={true}
      >
        {coverScreenContent}
      </CoverModel>
    </CoverScreenContext.Provider>
  );
}

const CoverScreenConsumer = CoverScreenContext.Consumer;
const useCover = () => React.useContext(CoverScreenContext);

export {
  CoverScreenContext,
  CoverScreenProvider,
  CoverScreenConsumer,
  useCover
};
