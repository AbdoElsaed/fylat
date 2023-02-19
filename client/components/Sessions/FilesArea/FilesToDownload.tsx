import React, { Dispatch, SetStateAction } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";

type FilesToDownloadParams = {
  filesToDownload: IFile[];
};

const FilesToDownload = ({ filesToDownload }: FilesToDownloadParams) => {
  const downloadThisFile = (url: string) => {
    window.open(url);
  };

  return (
    <div>
      <List
        sx={{
          width: "100%",
          maxWidth: 500,
          maxHeight: 400,
          overflowY: "auto",
          mb: 5,
        }}
      >
        {filesToDownload.map((f: IFile) => (
          <ListItem
            key={f.filename}
            secondaryAction={
              <IconButton
                title="Download"
                edge="end"
                aria-label="download"
                onClick={() => downloadThisFile(f.storageUrl)}
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
    </div>
  );
};

export default FilesToDownload;
