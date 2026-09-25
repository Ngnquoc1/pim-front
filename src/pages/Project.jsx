import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectForm from "../Components/Project/Form";
import {
  useProjectDetailQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../hooks/queries";
import { ROUTES } from "../constants/routes";

export default function Project() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // Fetch project details when in edit mode via TanStack Query
  const { data: projectData } = useProjectDetailQuery(id);

  // Mutations for creating and updating projects with cache invalidation
  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();

  // State to store server-side error message
  const [serverError, setServerError] = useState("");

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
        await updateProjectMutation.mutateAsync({ id, projectData: payload });
        navigate(ROUTES.PROJECTS, {
          state: { toastKey: "projectForm.updateSuccess" },
        });
      } else {
        await createProjectMutation.mutateAsync(payload);
        navigate(ROUTES.PROJECTS, {
          state: { toastKey: "projectForm.createSuccess" },
        });
      }
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
