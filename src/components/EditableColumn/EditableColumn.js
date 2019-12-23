import React, { useEffect, useState } from "react";
import SelectPlace from "../SelectPlace/SelectPlace";
import { useAuth0 } from "../../auth0";

const EditableColumn = ({ row, heatIndex, resultIndex, auth }) => {
  const { isAuthenticated } = useAuth0();
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const isManagePage = window.location.href.includes("manage");
    setCanEdit(isAuthenticated && isManagePage);
  }, [isAuthenticated]);

  return canEdit ? (
    <SelectPlace row={row} heatIndex={heatIndex} resultIndex={resultIndex} />
  ) : (
    <div>{row[resultIndex]}</div>
  );
};

export default EditableColumn;
