export function getSelectedService(selectedService?: number): string {
  if (selectedService) {
    return `${selectedService}`;
  }

  return '';
}