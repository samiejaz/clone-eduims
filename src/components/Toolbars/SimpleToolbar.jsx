import { Tag } from "primereact/tag";
import React from "react";
import { Button } from "primereact/button";

const SimpleToolbar = ({ startContent, title, onSaveClick }) => {
  return (
    <>
      <div className="flex align-content-center justify-content-between">
        <div className="flex-none">
          <p>
            Use <Tag value={"Ctrl"} severity={"primary"} />{" "}
            <span className="font-bold">+</span>{" "}
            <Tag value={"S"} severity={"primary"} /> to save.
          </p>
        </div>
        <div style={{ justifySelf: "center", flex: "2", textAlign: "center" }}>
          <h1 className="text-2xl fw-bold ">{title}</h1>
        </div>
        <div className="flex gap-2 flex-none">
          {/* <Button
              label="Edit"
              severity="warning"
              type="button"
              tooltip="Edit"
              className="rounded"
            /> */}
          <Button
            label="Save"
            severity="success"
            className="rounded"
            onClick={onSaveClick}
          />
        </div>
      </div>
    </>
  );
};

export default SimpleToolbar;
