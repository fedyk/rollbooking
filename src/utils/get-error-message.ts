export default function getErrorMessage(error: Error) {
  if (error && error.message) {
    return error.message;
  }

  if (error) {
    return error + '';
  }
  
  return '';
}
