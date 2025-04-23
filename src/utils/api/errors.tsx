export function errorHandler(error: any) {
  // Handle Axios error
  if (error.name === "Network Error") {
    return "Network error. Please check your internet connection.";
  }
  console.error("Axios error:", error.response?.data);
  let errorMessage = "";
  if (error.response?.data && typeof error.response.data === "object") {
    for (const key in error.response.data) {
      if (Array.isArray(error.response.data[key])) {
        errorMessage += `${key}: ${error.response.data[key].join(", ")} \n\n`;
      }
    }
  }
  const errorResponse =
    error.response?.data?.message ||
    error.response?.data?.detail ||
    error.message;

  errorMessage = errorMessage.trim() ? errorMessage : errorResponse;
  return errorMessage;
}
