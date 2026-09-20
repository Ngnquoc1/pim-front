import counterpart from "counterpart";

/**
 * Chuyển đổi ngày từ yyyy-MM-dd sang dd.MM.yyyy (chuẩn mockup ELCA)
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
 * Chuyển mã trạng thái sang chuỗi hiển thị đa ngôn ngữ
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