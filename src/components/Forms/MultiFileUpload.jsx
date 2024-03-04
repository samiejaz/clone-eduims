import React, { useEffect, useRef, useState } from "react";
import "./MultiFileUpload.css";
import {
  Download,
  Eye,
  File,
  Files,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const MultiFileUpload = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    setAllFiles(data) {
      setAllFiles(data);
    },
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
              <SIconButton
                onClick={uploadBtnClick}
                icon={<Upload />}
                color="cyan"
              />
              <SIconButton
                onClick={() => setFiles([])}
                icon={<X />}
                color="red"
              />
            </div>

            {/* <button className='s-file-input-icon' type='button'>Upload</button> */}
          </div>
          <div className="file-input_component-lower">
            <div style={{ width: "100%" }}>
              {files?.length > 0 ? (
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
                          <SIconButton
                            onClick={() => downloadFile(file)}
                            icon={<Download />}
                            color="#eee"
                          />
                          <SIconButton
                            onClick={() => removeFile(index)}
                            icon={<X />}
                            color="red"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-center-col">
                    <Files width="5rem" height="5rem" color="#758890" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        color: "#828890",
                        fontSize: "1.2rem",
                        fontWeight: "600",
                      }}
                    >
                      Upload Files Here...
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
      <div
        className="s-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 999 }}
      >
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
          <SIconButton
            onClick={() => {
              onClose();
              setZoomLevel(1);
            }}
            icon={<X />}
            color="#fff"
          />
          <SIconButton onClick={zoomIn} icon={<ZoomIn />} color="#fff" />
          <SIconButton onClick={zoomOut} icon={<ZoomOut />} color="#fff" />
        </div>
        <img
          src={imageSrc}
          alt="Preview"
          id="overLayImage"
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

const SIconButton = ({ icon, onClick, color = "cyan" }) => {
  return (
    <>
      <button
        type="button"
        className="s-file-input-icon"
        onClick={onClick}
        style={{ color: color, borderColor: color }}
      >
        {icon}
      </button>
    </>
  );
};
