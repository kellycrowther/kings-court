import styled from "styled-components";
import { Field } from "formik";
import { Select } from "antd";

export const FormInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 6px;
`;

export const StyledField = styled(Field)`
display: inline-block;
height: auto;
padding: 8px 14px 9px;
width: 100%;
font-size: 14px;
line-height: 19px;
color: #27373b;
background-color: white;
background-image: none;
border: 1px solid #ececec;
border-radius: 2px;
margin: ${props => (props.margin ? props.margin : "0 0 20px 0")}
height: 45px;
`;

export const FieldError = styled.div`
  padding: 0 0 20px 0px;
  width: 100%;
  transition: 0.28s;
  color: red;
`;

export const StyledSelect = styled(Select)`
  && {
    width: 100%;
    margin-bottom: 20px;
    padding: 8px 14px 9px;
    font-size: 14px;
    line-height: 19px;
    background-color: white;
    background-image: none;
    border: 1px solid #ececec;
    border-radius: 2px;
    height: 45px;
    .ant-select-selection {
      border: none;
      outline: 0;
      box-shadow: none !important;
    }
    .ant-select-selection__placeholder {
      color: rgba(0, 0, 0, 0.6);
    }
    .ant-select-selection__rendered {
      margin-left: 0px;
    }
  }
`;
