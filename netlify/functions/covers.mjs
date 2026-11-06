const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  },
  body: JSON.stringify(body)
});

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return response(204, {});
  return response(410, {
    error: "Paid AI cover generation is disabled. Chapter One creates its four cover thumbnails locally in the browser at no API cost.",
    provider: "Local Canvas",
    paidProviderDisabled: true
  });
};
