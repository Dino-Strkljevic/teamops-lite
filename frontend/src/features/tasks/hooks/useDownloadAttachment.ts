import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../lib/api";

/**
 * The download endpoint returns a 302 redirect to a MinIO presigned URL.
 * With axios + maxRedirects:0 we capture the Location header directly and
 * open it in a new tab — the file never proxies through the app.
 *
 * If the browser follows the redirect automatically (non-axios fetch env),
 * we fall back to reading the final response URL.
 */
async function fetchDownloadUrl(attachmentId: string): Promise<string> {
  const { headers, request } = await apiClient.get(
    `/attachments/${attachmentId}/download`,
    { maxRedirects: 0, validateStatus: (s) => s < 400 },
  );

  // Axios on the browser follows redirects automatically (XHR has no redirect
  // control), so the presigned URL ends up as the final responseURL.
  const presignedUrl: string | undefined =
    headers["location"] ?? (request as XMLHttpRequest | undefined)?.responseURL;

  if (!presignedUrl) {
    throw new Error("Could not resolve download URL");
  }
  return presignedUrl;
}

export function useDownloadAttachment() {
  return useMutation({
    mutationFn: fetchDownloadUrl,
    onSuccess: (url) => {
      window.open(url, "_blank", "noopener,noreferrer");
    },
  });
}
