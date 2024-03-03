import React, { useEffect, useRef, useState } from "react";
import "./MultiFileUpload.css";
import { Download, Eye, File, X, ZoomIn, ZoomOut } from "lucide-react";

const MultiFileUpload = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    setAllFiles(data) {},
    getAllFiles,
  }));
  const { name, id } = props;
  const [files, setFiles] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef();

  function uploadBtnClick() {
    fileInputRef.current?.click();
  }

  function getAllFiles() {
    return files;
  }

  function setAllFiles(files) {
    setFiles(files);
  }

  function onFileChange(e) {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  }

  function removeFile(index) {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openImageViewer(file) {
    setCurrentImage(URL.createObjectURL(file));
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="file-input_container">
        <div className="file-input_component">
          <div className="file-input_component-upper">
            <div>
              <button
                onClick={uploadBtnClick}
                className="s-file-input-icon"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-upload"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              </button>
              <button className="s-file-input-icon" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-x-circle"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </button>
            </div>

            {/* <button className='s-file-input-icon' type='button'>Upload</button> */}
          </div>
          <div className="file-input_component-lower">
            <div style={{ width: "100%" }}>
              {files.length > 0 ? (
                <>
                  <div className="flex-center-col-wg">
                    {files.map((file, index) => (
                      <div key={index} className="s-file-preview">
                        {file.type.startsWith("image/") ? (
                          <div
                            className="flex-center"
                            style={{ width: "40%", gap: "0.5rem" }}
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="s-preview-image"
                              width={"100"}
                              onClick={() => openImageViewer(file)}
                            />
                            <span style={{ fontWeight: "300" }}>
                              {file.name}
                            </span>
                          </div>
                        ) : (
                          <div className="s-doc-file">
                            <File width={"2rem"} height={"2rem"} />
                            <span style={{ fontWeight: "300" }}>
                              {file.name}
                            </span>
                          </div>
                        )}
                        <div>
                          <button
                            type="button"
                            className="s-file-input-icon"
                            onClick={() => downloadFile(file)}
                          >
                            <Download />
                          </button>
                          <button
                            type="button"
                            className="s-file-input-icon"
                            onClick={() => downloadFile(file)}
                          >
                            <Eye />
                          </button>
                          <button
                            type="button"
                            className="s-file-input-icon"
                            onClick={() => removeFile(index)}
                          >
                            <X />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-center-col">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="5rem"
                      height="5rem"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#424B57"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-files s-image-icon"
                    >
                      <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                      <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
                      <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
                    </svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        color: "#828890",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                      }}
                    >
                      Drag and Drop Image Here
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ImageViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={currentImage}
      />
      <input
        type="file"
        ref={fileInputRef}
        name={name}
        id={id}
        style={{ display: "none" }}
        onChange={onFileChange}
        multiple
      />
    </>
  );
});

export default MultiFileUpload;

// ImageViewerModal.js

const ImageViewerModal = ({ isOpen, onClose, imageSrc }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = () => setZoomLevel((prev) => prev + 0.1);
  const zoomOut = () => setZoomLevel((prev) => prev - 0.1);

  useEffect(() => {
    const closeOnEscapePressed = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", closeOnEscapePressed);
    return () => window.removeEventListener("keydown", closeOnEscapePressed);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="s-modal-overlay" onClick={onClose}>
      <div className="s-modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "0.7rem",
            color: "red",
          }}
          className="s-close-button"
        >
          <SIconButton onClick={onClose} icon={<X />} />

          <SIconButton onClick={zoomIn} icon={<ZoomIn />} />

          <SIconButton onClick={zoomOut} icon={<ZoomOut />} />
        </div>
        <img
          src={imageSrc}
          alt="Preview"
          style={{
            transform: `scale(${zoomLevel})`,
            margin: "auto",
            display: "block",
            userSelect: "none",
          }}
        />
      </div>
    </div>
  );
};

const SIconButton = (props) => {
  return (
    <>
      <button
        type="button"
        className="s-file-input-icon"
        onClick={props.onClick}
      >
        {props.icon}
      </button>
    </>
  );
};
