export const forgePilotWebhookEndpoint = "/api/webhooks/forgepilot";
export const forgePilotWebhookSecretHeader = "x-forgepilot-secret";

function getWebhookSecret() {
  return process.env.FORGEPILOT_WEBHOOK_SECRET?.trim() ?? "";
}

export function getWebhookConfigStatus() {
  return {
    endpoint: forgePilotWebhookEndpoint,
    secretHeader: forgePilotWebhookSecretHeader,
    secretConfigured: getWebhookSecret().length > 0,
  };
}

export function isWebhookSecretValid(request: Request) {
  const secret = getWebhookSecret();

  if (!secret) {
    return true;
  }

  return request.headers.get(forgePilotWebhookSecretHeader)?.trim() === secret;
}
