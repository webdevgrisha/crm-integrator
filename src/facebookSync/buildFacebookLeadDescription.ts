interface BuildFacebookLeadDescriptionData {
  description?: string;
  formBudget: string;
  purchasePlan: string;
}

function buildFacebookLeadDescription(
  data: BuildFacebookLeadDescriptionData
): string | undefined {
  const {description, formBudget, purchasePlan} = data;
  const descriptionParts = [
    description,
    formatDescriptionLine("Plan zakupu", purchasePlan),
    formatDescriptionLine("Budżet", formBudget),
  ].filter((item): item is string => Boolean(item));

  return descriptionParts.length ? descriptionParts.join("\n") : undefined;
}

function formatDescriptionLine(
  label: string,
  value: string
): string | undefined {
  const normalizedValue = normalizeFacebookOptionValue(value);

  return normalizedValue ? `${label}: ${normalizedValue}` : undefined;
}

function normalizeFacebookOptionValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export {buildFacebookLeadDescription};
