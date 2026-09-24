import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Translate from "react-translate-component";

const DeleteConfirmModal = ({
  show,
  onClose,
  onConfirm,
  isWarning = false,
  selectedItems = [],
  itemLabels = [],
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "17px", fontWeight: "600" }}>
          {isWarning ? (
            <Translate content="projectList.deleteModalWarningTitle" />
          ) : (
            <Translate content="projectList.deleteModalTitle" />
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "14px", color: "#495057", padding: "20px" }}>
        {isWarning ? (
          <p className="m-0">
            <Translate content="projectList.warningDeleteNewOnly" />
          </p>
        ) : (
          <div>
            <p className="mb-2">
              <Translate content="projectList.confirmDelete" />
            </p>
            {itemLabels.length > 0 && (
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  borderRadius: "4px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  marginTop: "10px",
                }}
              >
                <strong>{selectedItems.length}</strong>{" "}
                <Translate content="projectList.itemsSelected" />:{" "}
                {itemLabels.join(", ")}
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ padding: "12px 20px" }}>
        {isWarning ? (
          <button
            type="button"
            className="btn btn-pim-primary"
            onClick={onClose}
          >
            <Translate content="projectList.btnClose" />
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-pim-secondary mr-2"
              onClick={onClose}
            >
              <Translate content="projectForm.btnCancel" />
            </button>
            <button
              type="button"
              className="btn btn-danger"
              style={{
                height: "35px",
                padding: "6px 20px",
                fontWeight: "600",
                fontSize: "13px",
                borderRadius: "4px",
              }}
              onClick={onConfirm}
            >
              <Translate content="projectList.btnConfirmDelete" />
            </button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

DeleteConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isWarning: PropTypes.bool,
  selectedItems: PropTypes.array,
  itemLabels: PropTypes.arrayOf(PropTypes.string),
};

export default DeleteConfirmModal;
