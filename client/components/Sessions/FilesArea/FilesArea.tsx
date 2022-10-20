import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";

export const FilesArea = ({ isNew, userName, id, socket }: any) => {
  const [files, setFiles] = useState<any>([]);

  const formatFiles = (files: any) => {
    return [...files].map((f) => ({ filename: f.name, file: f }));
  };

  function upload(files: any) {
    const formattedFiles = formatFiles(files);
    socket.emit(
      "uploadfile",
      { files: formattedFiles, sessionId: id, },
      (status: any) => {
        console.log(status);
      }
    );
  }

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
          Share File
          <input
            name="files"
            type="file"
            multiple
            hidden
            onChange={(e) => handleFilesChange(e.target.files)}
          />
        </Button>
        {files && files.length ? (
          <List
            sx={{
              width: "100%",
              maxWidth: 400,
              maxHeight: 350,
              bgcolor: "#181818",
              overflowY: "auto",
            }}
          >
            {files.map((f: any) => (
              <ListItem
                key={f.name}
                secondaryAction={
                  <IconButton title="Download" edge="end" aria-label="delete">
                    <DownloadIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  sx={{ overflowWrap: "break-word" }}
                  primary={f.name}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography component="div">No files !!</Typography>
        )}
      </Grid>
    </Box>
  );
};
