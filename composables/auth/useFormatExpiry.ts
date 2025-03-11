export const useFormatExpiry = () => {
  const formatExpiry = (value: string): string => {
    let formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters

    // If first digit is between 2-9, prefix with '0'
    if (formattedValue.length === 1 && formattedValue[0] >= '2' && formattedValue[0] <= '9') {
      formattedValue = '0' + formattedValue;
    }

    // Ensure month is between 01-12
    if (formattedValue.length >= 2) {
      let month = parseInt(formattedValue.slice(0, 2), 10);
      if (month > 12) {
        formattedValue = '12';
      }
    }

    // Apply MM/YY format
    if (formattedValue.length > 2) {
      formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
    }

    return formattedValue.slice(0, 5); // Restrict to MM/YY format (5 characters)
  };

  return { formatExpiry };
};
