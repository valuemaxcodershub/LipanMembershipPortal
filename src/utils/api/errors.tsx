export function errorHandler(error: any) {
  // Handle Axios error
  if (error.name === "Network Error") {
    return "Network error. Please check your internet connection.";
  }
  console.error("Axios error:", error.response?.data);
  if (error.response?.data && typeof error.response.data === "object") {
    let errorMessage = "Errors:\n";
    for (const key in error.response.data) {
      if (Array.isArray(error.response.data[key])) {
        errorMessage += `${key}: ${error.response.data[key].join(", ")} \n\n`;
      }
    }
    console.log(errorMessage)
    return errorMessage;
  }
  return (
    error.response?.data?.message ||
    error.response?.data?.detail ||
    error.message
  );
}
