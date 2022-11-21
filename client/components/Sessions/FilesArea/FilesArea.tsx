import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";

export const FilesArea = ({ isNew, userName, id: sessionId, socket }: any) => {
  const [files, setFiles] = useState<any>([]);
  const [filesToDownload, setFilesToDownload] = useState<any>([]);

  useEffect(() => {
    // get initial files
    socket.emit("getInitFiles", { sessionId }, (err: Error, files: any) => {
      if (!err) return setFilesToDownload(files);
      console.error(err);
    });

    socket.on("newFileAdded", (f: any) => setFilesToDownload(f));
  }, [sessionId, socket]);

  const formatFiles = (files: any) => {
    return [...files].map((f) => ({ filename: f.name, file: f }));
  };

  function upload(files: any) {
    const formattedFiles = formatFiles(files);
    socket.emit(
      "uploadfile",
      { files: formattedFiles, sessionId },
      (status: any) => {
        console.log(status);
      }
    );
  }

  const downloadThisFile = (filename: any) => {
    const { file } = filesToDownload.find((f: any) => f.filename === filename);
    const blob = new Blob([file]);
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  const handleFilesChange = (files: any) => {
    const f = [...files];
    setFiles(f);
    upload(files);
  };

  return (
    <Box sx={{ flexGrow: 10 }}>
      <Grid item xs={12}>
        <Button
          sx={{ mb: 5 }}
          variant="outlined"
          component="label"
          startIcon={<AttachFileIcon />}
        >
          Share Files
          <input
            name="files"
            type="file"
            multiple
            hidden
            onChange={(e) => handleFilesChange(e.target.files)}
          />
        </Button>
        {filesToDownload && filesToDownload.length ? (
          <List
            sx={{
              width: "100%",
              maxWidth: 500,
              maxHeight: 400,
              overflowY: "auto",
              marginBottom: 5,
            }}
          >
            {filesToDownload.map((f: any) => (
              <ListItem
                key={f.filename}
                secondaryAction={
                  <IconButton
                    title="Download"
                    edge="end"
                    aria-label="download"
                    onClick={() => downloadThisFile(f.filename)}
                  >
                    <DownloadIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  sx={{ overflowWrap: "break-word" }}
                  primary={f.filename}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography component="div">No files yet.</Typography>
        )}
      </Grid>
    </Box>
  );
};
