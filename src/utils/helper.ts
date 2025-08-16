export const trimValues = (values: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  );
};

export const handlePaste = (e) => {
  const pastedValue = e.clipboardData.getData('text');

  // Check if it's a valid number
  if (isNaN(Number(pastedValue))) {
    e.preventDefault(); // Stop the paste
  }
};

