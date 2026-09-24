import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectForm from "../Components/Project/Form";
import projectService from "../services/projectService";
import { ROUTES } from "../constants/routes";

export default function Project() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // State to store project details when editing
  const [projectData, setProjectData] = useState(null);

  // State to store server-side error message
  const [serverError, setServerError] = useState("");

  // Fetch project details if in Edit mode
  useEffect(() => {
    if (isEditMode && id) {
      projectService
        .getProjectById(id)
        .then((response) => {
          setProjectData(response.data || response);
        })
        .catch((error) => {
          console.error("Failed to fetch project: ", error);
        });
    }
  }, [isEditMode, id]);

  // Navigate back to project list screen (preserving search criteria and URL)
  const handleCancel = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(ROUTES.PROJECTS);
    }
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (formData) => {
    setServerError(""); // Clear previous server errors

    // Format payload matching ProjectDto
    const payload = {
      projectNumber: Number(formData.projectNumber),
      name: formData.name.trim(),
      customer: formData.customer.trim(),
      groupId: Number(formData.groupId),
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      version: formData.version,
      memberVisas: formData.members,
    };

    try {
      if (isEditMode) {
        await projectService.updateProject(id, payload);
      } else {
        await projectService.createProject(payload);
      }

      // Navigate back to project list on success
      navigate(ROUTES.PROJECTS);
    } catch (error) {
      console.error("Save project failed: ", error);
      if (error.response && error.response.status < 500) {
        setServerError(error.response.data?.message || "Operation failed");
      }
    }
  };

  return (
    <ProjectForm
      isEditMode={isEditMode}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      serverError={serverError}
      projectData={projectData}
    />
  );
}
