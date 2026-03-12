import { useRef, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useAttachments } from "../hooks/useAttachments";
import { useUploadAttachment } from "../hooks/useUploadAttachment";
import { useDownloadAttachment } from "../hooks/useDownloadAttachment";

interface AttachmentsSectionProps {
  taskId: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SnackState = { open: boolean; severity: "success" | "error"; msg: string };

const SNACK_CLOSED: SnackState = { open: false, severity: "success", msg: "" };

export default function AttachmentsSection({
  taskId,
}: AttachmentsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snack, setSnack] = useState<SnackState>(SNACK_CLOSED);

  const { data: attachments, isLoading, isError } = useAttachments(taskId);
  const upload = useUploadAttachment(taskId);
  const download = useDownloadAttachment();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so the same file can be re-selected if needed
    e.target.value = "";
    if (!file) return;

    upload.mutate(file, {
      onSuccess: () =>
        setSnack({ open: true, severity: "success", msg: "File uploaded." }),
      onError: () =>
        setSnack({
          open: true,
          severity: "error",
          msg: "Upload failed. Please try again.",
        }),
    });
  }

  function handleDownload(attachmentId: string) {
    download.mutate(attachmentId, {
      onError: () =>
        setSnack({
          open: true,
          severity: "error",
          msg: "Could not start download. Please try again.",
        }),
    });
  }

  return (
    <>
      <Divider />

      {/* Header row */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Attachments
          {attachments && attachments.length > 0 && (
            <Box component="span" sx={{ ml: 0.75, fontWeight: 400 }}>
              ({attachments.length})
            </Box>
          )}
        </Typography>

        <Tooltip title="Upload file">
          {/* span wrapper keeps the tooltip working while button may be disabled */}
          <span>
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={upload.isPending}
              aria-label="Upload attachment"
            >
              {upload.isPending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <UploadFileIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Box>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={20} />
        </Box>
      )}

      {/* Error */}
      {isError && (
        <Box sx={{ px: 3, pb: 1 }}>
          <Alert
            severity="error"
            variant="outlined"
            sx={{ fontSize: "0.8rem" }}
          >
            Failed to load attachments.
          </Alert>
        </Box>
      )}

      {/* List */}
      {!isLoading && !isError && (
        <Stack spacing={0.5} sx={{ mx: 3, mb: 2.5 }}>
          {attachments?.length === 0 && (
            <Typography
              variant="body2"
              color="text.disabled"
              fontStyle="italic"
            >
              No attachments yet.
            </Typography>
          )}

          {attachments?.map((att) => (
            <Box
              key={att.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <AttachFileIcon
                fontSize="small"
                sx={{ color: "text.disabled", flexShrink: 0 }}
              />

              {/* Name + meta */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  noWrap
                  title={att.fileName}
                >
                  {att.fileName}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {formatBytes(att.sizeBytes)}
                  {att.createdAt && ` · ${formatDateTime(att.createdAt)}`}
                </Typography>
              </Box>

              {/* Download */}
              <Tooltip title="Download">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(att.id)}
                    disabled={download.isPending}
                    aria-label={`Download ${att.fileName}`}
                  >
                    {download.isPending ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : (
                      <DownloadIcon fontSize="small" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))}
        </Stack>
      )}

      {/* Snackbar feedback */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(SNACK_CLOSED)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack(SNACK_CLOSED)}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
