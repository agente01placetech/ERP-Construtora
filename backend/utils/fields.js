export function pick(source, allowedFields) {
  return Object.fromEntries(
    allowedFields
      .filter((field) => Object.prototype.hasOwnProperty.call(source, field))
      .map((field) => [field, source[field]])
  );
}

export function isPositiveNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}
