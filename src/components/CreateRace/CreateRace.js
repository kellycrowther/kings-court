import React, { useRef, Fragment, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Papa from "papaparse";
import { Button, Icon, Select, message, Typography } from "antd";
import { useAuth0 } from "../../auth0";
import "./CreateRace.css";
import { StyledField, FormInner, FieldError, StyledSelect } from "../Forms";

const { Option } = Select;
const { Title } = Typography;

function readCSV(info) {
  let reader = new FileReader();
  // need promise to ensure program doesn't continuing executing without having processed the data
  return new Promise(resolve => {
    reader.addEventListener("error", () => {
      message.error(
        "There was a problem uploading the CSV. Refresh the page and try again."
      );
      console.error("Manage->readCSV()->error");
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
      setHeats(csvData.data);
      resolve(csvData.data);
    };
    reader.readAsText(info);
  });
}

function setHeats(csvData) {
  // females start with heat 1, males 2
  let currentFemaleHeat = 1;
  let currentMaleHeat = 2;
  let currentFemaleCount = 0;
  let currentMaleCount = 0;
  csvData.map(row => {
    // we are hardcoding the heats to have 6 and less skiers
    if (row.Gender === "Female" && currentFemaleCount <= 6) {
      row.Round1Heat = currentFemaleHeat;
      // add 1 to the skier count and reset if the count is equal to 6
      currentFemaleCount = currentFemaleCount < 6 ? currentFemaleCount + 1 : 1;
      // we are alternating odd / even heats with girls being odd number and boys even so add two to the initial heat
      currentFemaleHeat =
        currentFemaleCount < 6 ? currentFemaleHeat : currentFemaleHeat + 2;
    }
    if (row.Gender === "Male" && currentMaleCount <= 6) {
      row.Round1Heat = currentMaleHeat;
      currentMaleCount = currentMaleCount < 6 ? currentMaleCount + 1 : 1;
      currentMaleHeat =
        currentMaleCount < 6 ? currentMaleHeat : currentMaleHeat + 2;
    }
    return row;
  });
}

function UploadFile({ inputFile }) {
  function handleSelect(info) {
    inputFile.current.click();
  }
  return (
    <Button onClick={handleSelect}>
      <Icon type="upload" /> Upload Seeds
    </Button>
  );
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

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  organization: Yup.string().required("Organization is required")
});

const CreateRace = ({ createRace, setRacersToStore }) => {
  const [uploaded, setUploaded] = useState(null);
  const [fileName, setFileName] = useState("");
  const [seeds, setSeeds] = useState([]);
  const { user } = useAuth0();

  const inputFile = useRef(null);

  const initialValues = {
    name: "",
    organization: ""
  };

  function onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    setFileName(file.name);
    readCSV(file)
      .then(csvData => {
        setUploaded(true);
        setSeeds(csvData);
      })
      .catch(e => {
        setUploaded(false);
      });
  }

  function onSubmit(event) {
    const race = {
      name: event.name,
      userId: user.sub,
      wsName: event.organization,
      results: seeds
    };
    setRacersToStore(seeds);
    createRace(race);
  }

  return (
    <Fragment>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit} autoComplete="off">
            <FormInner>
              <Title level={1}>Create Race</Title>

              <StyledField
                type="text"
                name="name"
                placeholder="Enter name"
                onChange={handleChange}
                value={values.name}
              />
              {errors.name && touched.name && (
                <FieldError>{errors.name}</FieldError>
              )}
              <StyledSelect
                placeholder="Select Organization"
                onChange={value => setFieldValue("organization", value)}
              >
                <Option value="oisra">OISRA</Option>
                <Option value="mbsef">MBSEF</Option>
                <Option value="pnsa">PNSA</Option>
              </StyledSelect>
              {errors.organization && touched.organization && (
                <FieldError>{errors.organization}</FieldError>
              )}
              <UploadFile inputFile={inputFile} />
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
              <Button
                type="primary"
                htmlType="submit"
                className="submit-btn"
                disabled={!values.name || !values.organization || !fileName}
              >
                <Icon type="thunderbolt" />
                Create Race
              </Button>
            </FormInner>
          </form>
        )}
      </Formik>
    </Fragment>
  );
};

export default CreateRace;
