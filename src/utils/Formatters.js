import counterpart from "counterpart";

/**
 * Format date from yyyy-MM-dd to dd.MM.yyyy (ELCA mockup standard)
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
};

/**
 * Format status code to multilingual display string
 */
export const formatStatus = (status) => {
  switch (status) {
    case "NEW":
      return counterpart.translate("projectList.statusNew");
    case "PLA":
      return counterpart.translate("projectList.statusPla");
    case "INP":
      return counterpart.translate("projectList.statusInp");
    case "FIN":
      return counterpart.translate("projectList.statusFin");
    default:
      return status || "";
  }
};