import { useState } from "react";

const defaultWidth = 512;

export default function useDialogControls(initialState) {
  const [isVisible, setVisibility] = useState(initialState);
  const [content, setContent] = useState(null);
  const [width, setWidth] = useState(defaultWidth);
  const [props, setProps] = useState({});

  const open = (component, opts) => {
    // let customWidth = defaultWidth;
    opts = opts || {};

    if (typeof opts === "string") {
      opts = { customWidth: opts };
    }

    setWidth(defaultWidth);
    setProps(opts.props || {});
    setContent(component);
    setVisibility(true);
  };

  const close = () => {
    setContent(null);
    setVisibility(false);
  };

  return [isVisible, open, close, content, width, props];
}
