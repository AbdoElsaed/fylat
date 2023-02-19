import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FilesToUpload from "./FilesToUpload";
import FilesToDownload from "./FilesToDownload";

interface FilesAreaParams {
  id: string;
  filesToDownload: IFile[];
}

export const FilesArea = ({
  id: sessionId,
  filesToDownload,
}: FilesAreaParams) => {
  const [showShareFilesBtn, setShowShareFilesBtn] = useState<boolean>(true);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [uploadingFilesStatus, setUploadingFilesStatus] =
    useState<uploadingFilesStatus>({});

  useEffect(() => {}, []);

  const setInitialUploadingStatus = (files: File[]) => {
    const initialStatus = files.reduce((acc, f) => {
      acc[f.name] = { uploaded: false };
      return acc;
    }, {} as uploadingFilesStatus);
    setUploadingFilesStatus(initialStatus);
  };

  const handleFilesChange = (files: FileList) => {
    // const formattedFiles = formatFiles(files);
    const currFiles = [...files];
    setInitialUploadingStatus(currFiles);
    setFilesToUpload(currFiles);
  };

  return (
    <Box sx={{ flexGrow: 10 }}>
      <Typography
        variant="h5"
        sx={{
          color: "#DDD",
          textShadow: "1px 1px 4px #158af8",
          borderBottom: "1px solid #222",
          width: "max-content",
          margin: "auto",
          mb: 3,
        }}
        letterSpacing={1}
      >
        Session Files:
      </Typography>
      <Grid item xs={12}>
        <Button
          sx={{ mb: 5, ml: 3 }}
          variant="outlined"
          component="label"
          startIcon={<AttachFileIcon />}
          disabled={!showShareFilesBtn}
        >
          Share Files
          <input
            name="files"
            type="file"
            multiple
            hidden
            onChange={(e) => handleFilesChange(e.target.files as FileList)}
          />
        </Button>

        {filesToUpload && filesToUpload.length ? (
          <FilesToUpload
            uploadingFilesStatus={uploadingFilesStatus}
            setUploadingFilesStatus={setUploadingFilesStatus}
            filesToUpload={filesToUpload}
            setFilesToUpload={setFilesToUpload}
            sessionId={sessionId}
            setShowShareFilesBtn={setShowShareFilesBtn}
          />
        ) : null}

        {filesToDownload && filesToDownload.length ? (
          <FilesToDownload filesToDownload={filesToDownload} />
        ) : (
          <Typography sx={{ ml: 2 }} component="div" color="#888">
            No files to download!.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};
