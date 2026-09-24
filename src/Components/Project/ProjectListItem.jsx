import React from "react";
import { Link } from "react-router-dom";
import { formatDate, formatStatus } from "../../utils/Formatters";
import TrashIcon from "../Common/TrashIcon";

export const ProjectListItem = ({
  project,
  isSelected,
  onToggleSelected,
  onDeleteProject,
}) => {
  return (
    <tr className={isSelected ? "table-active" : ""}>
      {/* Row checkbox */}
      <td className="text-center align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelected(project.id)}
          style={{ width: "15px", height: "15px", cursor: "pointer" }}
        />
      </td>

      {/* Project number: Hyperlink to edit page */}
      <td className="text-right align-middle font-weight-bold">
        <Link
          to={`/projects/edit/${project.id}`}
          className="text-primary text-decoration-none"
        >
          {project.projectNumber}
        </Link>
      </td>

      {/* Project name*/}
      <td className="text-left align-middle font-weight-bold text-dark">
        {project.name}
      </td>

      {/* Status: Default Segoe UI, 14px, #666666 per us_2_guide.jpg */}
      <td className="text-left align-middle">
        {formatStatus(project.status)}
      </td>

      {/* Customer */}
      <td className="text-left align-middle">
        {project.customer}
      </td>

      {/* Start date: dd.MM.yyyy*/}
      <td className="text-center align-middle">
        {formatDate(project.startDate)}
      </td>

      {/* Delete action: Only displayed when status is 'NEW' */}
      <td className="text-center align-middle">
        {project.status === "NEW" ? (
          <TrashIcon onClick={() => onDeleteProject([project.id])} />
        ) : null}
      </td>
    </tr>
  );
};

export default ProjectListItem;