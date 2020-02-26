import React from "react";
import { Button, Icon } from "antd";

const { Parser } = require("json2csv");

function DownloadCsv({ btnName, fileName, data }) {
  fileName = fileName || "final-results.csv";
  btnName = btnName || "Download Final Results";

  const downloadCSV = () => {
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);
    let hiddenElement = document.createElement("a");
    // important to use URI and not blob so Safari iPad works
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = fileName;
    hiddenElement.click();
  };
  return (
    <Button onClick={downloadCSV} type="primary" className="download-final-btn">
      <Icon type="download" /> Download Final Results
    </Button>
  );
}

export default DownloadCsv;
