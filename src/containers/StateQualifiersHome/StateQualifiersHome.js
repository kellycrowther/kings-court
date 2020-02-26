import React from "react";
import UploadCsv from "../../components/UploadCsv/UploadCsv";

function StateQualifiersHome() {
  const handleUpload = data => {
    console.info("DATA: ", data);
  };

  return (
    <div>
      <h2>State Qualifiers</h2>
      <p>
        Welcome to the State Qualifiers tool. Simply upload your formatted
        results to calculate the state qualifiers.
      </p>

      <UploadCsv name="Upload Results" handleClick={handleUpload} />
    </div>
  );
}

export default StateQualifiersHome;
