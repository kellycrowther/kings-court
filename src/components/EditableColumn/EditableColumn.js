import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import SelectPlace from "../SelectPlace/SelectPlace";

const EditableColumn = ({ row, heatIndex, resultIndex, auth }) => {
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const isLoggedIn = auth.isLoggedIn;
    const isManagePage = window.location.href.includes("manage");
    setCanEdit(isLoggedIn && isManagePage);
  }, [auth.isLoggedIn]);

  return canEdit ? (
    <SelectPlace row={row} heatIndex={heatIndex} resultIndex={resultIndex} />
  ) : (
    <div>{row[resultIndex]}</div>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(EditableColumn);
