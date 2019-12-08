import React, { useState } from "react";
import { Modal, Input } from "antd";

export default function LoginModal({ visible, setLoginVisible, handleLogin }) {
  const [password, setPassword] = useState("");

  const handleOk = e => {
    console.info("E: ", e);
    console.info("PASSWORD: ", password);
    handleLogin(password);
    setLoginVisible(false);
  };

  const handleCancel = e => {
    setLoginVisible(false);
  };

  return (
    <div>
      <Modal
        title="Login"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input.Password
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
}
