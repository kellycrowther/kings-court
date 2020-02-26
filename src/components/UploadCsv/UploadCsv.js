import React, { useRef, useState, Fragment } from "react";
import { Button, Icon, message } from "antd";
import Papa from "papaparse";

function readCSV(info) {
  let reader = new FileReader();
  // need promise to ensure program doesn't continuing executing without having processed the data
  return new Promise(resolve => {
    reader.addEventListener("error", () => {
      message.error(
        "There was a problem uploading the CSV. Refresh the page and try again."
      );
      console.error("UploadCsv->readCSV()->error");
      reader.abort();
    });
    reader.onload = e => {
      // ipad Numbers adds extra lines - this removes them to normalize it
      let result = e.target.result;
      if (result.includes("Table 1,,,,,,,,,")) {
        result = result.replace("Table 1,,,,,,,,,", "");
      }
      if (result.includes(",,,,,,,,,")) {
        result = result.replace(",,,,,,,,,", "");
      }
      const csvData = Papa.parse(result, {
        dynamicTyping: true,
        columns: true,
        skipEmptyLines: true,
        header: true
      });
      if (csvData.errors.length > 0) {
        message.error(
          "There was a problem parsing the CSV. Make sure the CSV is in the correct format. Only include column headers and associated data.",
          5
        );
      }
      resolve(csvData.data);
    };
    reader.readAsText(info);
  });
}

function UploadedConfirmation({ uploaded, fileName }) {
  if (uploaded) {
    return (
      <div style={{ margin: "1rem 0 0 0" }}>
        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
        &nbsp; Successfully Uploaded {fileName}
      </div>
    );
  } else if (uploaded === false) {
    return (
      <div>
        <Icon type="cross" /> Failed To Upload
      </div>
    );
  } else {
    return null;
  }
}

function UploadCsv({ name, handleClick }) {
  const [uploaded, setUploaded] = useState(null);
  const [fileName, setFileName] = useState("");
  const inputFile = useRef(null);

  function handleSelect(info) {
    inputFile.current.click();
  }

  function onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    setFileName(file.name);
    readCSV(file)
      .then(csvData => {
        setUploaded(true);
        handleClick(csvData);
      })
      .catch(e => {
        setUploaded(false);
        console.error("StateQualifiesHome->OnChangeFile->error", e);
      });
  }

  return (
    <Fragment>
      <Button onClick={handleSelect}>
        <Icon type="upload" /> {name}
      </Button>
      <input
        type="file"
        id="file"
        name="file"
        accept=".csv, text/csv"
        ref={inputFile}
        onChange={onChangeFile}
        style={{ display: "none" }}
      />
      <UploadedConfirmation uploaded={uploaded} fileName={fileName} />
    </Fragment>
  );
}

export default UploadCsv;
