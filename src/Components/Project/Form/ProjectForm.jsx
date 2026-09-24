import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import groupService from "../../../services/groupService";
import MemberAutocomplete from "../MemberAutocomplete";
import ErrorAlert from "../../Common/ErrorAlert";
import { useLocale } from "../../../store/useProjectStore";
import styles from "./ProjectForm.module.css";

function ProjectForm({ isEditMode, onCancel, onSubmit, serverError, projectData }) {
  useLocale(); // Trigger re-render when language changes
  const [groups, setGroups] = useState([]);
  const [dismissedErrors, setDismissedErrors] = useState({});

  useEffect(() => {
    if (serverError) {
      setDismissedErrors((prev) => ({ ...prev, server: false }));
    }
  }, [serverError]);

  useEffect(() => {
    // Fetch groups for Group dropdown
    groupService
      .getAllGroups()
      .then((response) => {
        setGroups(response.data || response || []);
      })
      .catch((error) => {
        console.error("Failed to load groups: ", error);
      });
  }, []);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      projectNumber: "",
      name: "",
      customer: "",
      groupId: "",
      members: [], // Array of employee visas
      status: "NEW", // Default status for new projects
      startDate: "",
      endDate: "",
      version: 0,
    },
  });

  useEffect(() => {
    if (isEditMode && projectData) {
      reset({
        projectNumber: projectData.projectNumber,
        name: projectData.name,
        customer: projectData.customer,
        groupId: projectData.groupId,
        members: projectData.members
          ? projectData.members.map((m) => m.visa)
          : [],
        status: projectData.status,
        startDate: projectData.startDate,
        endDate: projectData.endDate || "",
        version: projectData.version,
      });
    }
  }, [isEditMode, projectData, reset]);

  // Watch startDate for cross-field validation with endDate
  const startDate = watch("startDate");

  const hasMandatoryError =
    errors.projectNumber?.type === "required" ||
    errors.name?.type === "required" ||
    errors.customer?.type === "required" ||
    errors.groupId?.type === "required" ||
    errors.status?.type === "required" ||
    errors.startDate?.type === "required";

  const handleFormSubmit = (data) => {
    setDismissedErrors({});
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleFormError = () => {
    // Reset dismissed state so banners appear again if submit fails validation
    setDismissedErrors({});
  };

  return (
    <div className={styles.projectFormContainer}>
      {/* Dynamic Title based on Create or Edit mode */}
      <h2 className={styles.projectFormTitle}>
        {isEditMode ? (
          <Translate content="projectForm.editTitle" />
        ) : (
          <Translate content="projectForm.newTitle" />
        )}
      </h2>
      <hr className={styles.projectFormDivider} />

      <div className={styles.formContentWrapper}>
        {/* Global Error Banners with Dismiss ('x') Button */}
      <ErrorAlert
        show={hasMandatoryError && !dismissedErrors.mandatory}
        content="projectForm.mandatoryNotice"
        onDismiss={() =>
          setDismissedErrors((prev) => ({ ...prev, mandatory: true }))
        }
      />

      <ErrorAlert
        show={errors.endDate?.type === "validate" && !dismissedErrors.dateRange}
        content="projectForm.invalidDateRange"
        onDismiss={() =>
          setDismissedErrors((prev) => ({ ...prev, dateRange: true }))
        }
      />

      <ErrorAlert
        show={
          errors.projectNumber?.type === "validate" &&
          !dismissedErrors.projectNumber
        }
        content="projectForm.invalidProjectNumber"
        onDismiss={() =>
          setDismissedErrors((prev) => ({ ...prev, projectNumber: true }))
        }
      />

      <ErrorAlert
        show={Boolean(serverError) && !dismissedErrors.server}
        message={serverError}
        onDismiss={() =>
          setDismissedErrors((prev) => ({ ...prev, server: true }))
        }
      />

      <form noValidate onSubmit={handleSubmit(handleFormSubmit, handleFormError)}>
        {/* Project Number */}
        <div className={styles.projectFormRow}>
          <label className={styles.projectFormLabel}>
            <Translate content="projectForm.fieldNumber" />
            <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.projectInputArea}>
            <input
              type="number"
              disabled={isEditMode}
              tabIndex={isEditMode ? -1 : 0}
              autoFocus={!isEditMode}
              className={`form-control ${styles.formControl} ${styles.inputShort} ${
                errors.projectNumber ? styles.isInvalid : ""
              }`}
              onInput={(e) => {
                if (e.target.value.length > 4) {
                  e.target.value = e.target.value.slice(0, 4);
                }
              }}
              {...register("projectNumber", {
                required: !isEditMode,
                validate: (val) => {
                  if (isEditMode || !val) return true;
                  const num = Number(val);
                  return (
                    (Number.isInteger(num) &&
                      num > 0 &&
                      num <= 9999 &&
                      /^[0-9]{1,4}$/.test(String(val).trim())) ||
                    "invalidProjectNumber"
                  );
                },
              })}
            />
          </div>
        </div>

        {/* Project Name */}
        <div className={styles.projectFormRow}>
          <label className={styles.projectFormLabel}>
            <Translate content="projectForm.fieldName" />
            <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.projectInputArea}>
            <input
              type="text"
              maxLength={50}
              autoFocus={isEditMode}
              className={`form-control ${styles.formControl} ${styles.inputFull} ${
                errors.name ? styles.isInvalid : ""
              }`}
              {...register("name", {
                required: true,
                maxLength: 50,
              })}
            />
          </div>
        </div>

        {/* Customer */}
        <div className={styles.projectFormRow}>
          <label className={styles.projectFormLabel}>
            <Translate content="projectForm.fieldCustomer" />
            <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.projectInputArea}>
            <input
              type="text"
              maxLength={50}
              className={`form-control ${styles.formControl} ${styles.inputFull} ${
                errors.customer ? styles.isInvalid : ""
              }`}
              {...register("customer", {
                required: true,
                maxLength: 50,
              })}
            />
          </div>
        </div>

        {/* Group */}
        <div className={styles.projectFormRow}>
          <label className={styles.projectFormLabel}>
            <Translate content="projectForm.fieldGroup" />
            <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.projectInputArea}>
            <select
              className={`form-control ${styles.formControl} ${styles.inputShort} ${
                errors.groupId ? styles.isInvalid : ""
              }`}
              {...register("groupId", { required: true })}
            >
              <option value="">{counterpart.translate("projectForm.selectGroup")}</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  Group - {group.groupLeaderVisa}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Members Autocomplete Component */}
        <div className={styles.projectFormRow}>
          <label className={styles.projectFormLabel}>
            <Translate content="projectForm.fieldMembers" />
          </label>
          <div className={styles.projectInputArea}>
            <MemberAutocomplete
              value={watch("members") || []}
              initialMembers={projectData?.members}
              onChange={(val) =>
                setValue("members", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              isInvalid={!!errors.members}
            />
          </div>
        </div>

        {/* Status */}
        <div className={styles.projectFormRow}>
          <label className={styles.projectFormLabel}>
            <Translate content="projectForm.fieldStatus" />
            <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.projectInputArea}>
            <select
              className={`form-control ${styles.formControl} ${styles.inputShort} ${
                errors.status ? styles.isInvalid : ""
              }`}
              {...register("status", { required: true })}
            >
              <option value="NEW">{counterpart.translate("projectList.statusNew")}</option>
              <option value="PLA">{counterpart.translate("projectList.statusPla")}</option>
              <option value="INP">{counterpart.translate("projectList.statusInp")}</option>
              <option value="FIN">{counterpart.translate("projectList.statusFin")}</option>
            </select>
          </div>
        </div>

        {/* Start Date & End Date */}
        <div className={styles.projectFormRow}>
          <label className={styles.projectFormLabel}>
            <Translate content="projectForm.fieldStartDate" />
            <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.projectInputArea}>
            <div className={styles.dateRowContainer}>
              <input
                type="date"
                className={`form-control ${styles.formControl} ${styles.inputShort} ${
                  errors.startDate ? styles.isInvalid : ""
                }`}
                {...register("startDate", { required: true })}
              />
              <div className={styles.dateGroupRight}>
                <span className={styles.dateSeparatorLabel}>
                  <Translate content="projectForm.fieldEndDate" />
                </span>
                <input
                  type="date"
                  className={`form-control ${styles.formControl} ${styles.inputShort} ${
                    errors.endDate ? styles.isInvalid : ""
                  }`}
                  {...register("endDate", {
                    validate: (val) =>
                      !val || !startDate || val >= startDate || "invalidDateRange",
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.formActionsWrapper}>
          <button
            type="button"
            className={`btn btn-pim-secondary ${styles.btnCancelCustom}`}
            onClick={onCancel}
          >
            <Translate content="projectForm.btnCancel" />
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn btn-pim-primary ${styles.btnSubmitCustom}`}
          >
            {isEditMode ? (
              <Translate content="projectForm.btnSave" />
            ) : (
              <Translate content="projectForm.btnCreate" />
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default ProjectForm;
