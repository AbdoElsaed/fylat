import React, { Dispatch, FC, SetStateAction, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoopIcon from "@mui/icons-material/Loop";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { StorageReference, TaskState } from "firebase/storage";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";

import {
  db,
  uploadFileToStorage,
  getDownloadedFileUrl,
} from "@/utils/firebase";

type uploadFileToStorageParams = {
  reference: StorageReference;
  state: TaskState;
};

type FilesToUploadParams = {
  uploadingFilesStatus: uploadingFilesStatus;
  setUploadingFilesStatus: Dispatch<SetStateAction<uploadingFilesStatus>>;
  filesToUpload: File[];
  setFilesToUpload: Dispatch<SetStateAction<File[]>>;
  sessionId: string;
  setShowShareFilesBtn: Dispatch<SetStateAction<boolean>>;
};

const FilesToUpload = ({
  uploadingFilesStatus,
  setUploadingFilesStatus,
  filesToUpload,
  setFilesToUpload,
  sessionId,
  setShowShareFilesBtn,
}: FilesToUploadParams) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [finishedLoading, setIsFinishedLoading] = useState<boolean>(false);

  const sessionRef = doc(db, "sessions", sessionId);

  const clearFilesToUpload = () => {
    setFilesToUpload([]);
    setShowShareFilesBtn(true);
  };

  const uploadFiles = async () => {
    let downloadFilesUrls: IFile[] = [];
    setShowShareFilesBtn(false);
    setIsUploading(true);
    for (let file of filesToUpload) {
      try {
        const { reference, state } = (await uploadFileToStorage(
          file,
          sessionId
        )) as uploadFileToStorageParams;
        if (state === "success") {
          setUploadingFilesStatus((prevState) => ({
            ...prevState,
            [file.name]: { uploaded: true },
          }));
          const storageUrl = await getDownloadedFileUrl(reference);
          downloadFilesUrls.push({ filename: file.name, storageUrl });
        }
      } catch (err) {
        console.error(err);
      }
    }
    setIsUploading(false);
    setIsFinishedLoading(true);

    await updateDoc(sessionRef, {
      files: arrayUnion(...downloadFilesUrls),
    });
  };

  return (
    <Stack flexDirection="column" sx={{ mb: 3, ml: 1 }}>
      <Stack
        sx={{ maxHeight: "200px", overflowY: "auto" }}
        flexDirection="column"
      >
        {filesToUpload.map((fileToUpload, indx) => (
          <div
            key={indx}
            style={{
              display: "flex",
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            {uploadingFilesStatus[fileToUpload.name].uploaded ? (
              <PublishedWithChangesIcon sx={{ color: "green", mr: 1 }} />
            ) : (
              <LoopIcon
                sx={{
                  color: "#666",
                  mr: 1,
                  animation: isUploading ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": {
                      transform: "rotate(-360deg)",
                    },
                    "100%": {
                      transform: "rotate(0deg)",
                    },
                  },
                }}
              />
            )}

            <Typography component="span" sx={{ color: "#CCC" }}>
              {indx + 1}:
            </Typography>
            <Typography component="span" sx={{ color: "#999", ml: 1 }}>
              {fileToUpload.name}
            </Typography>
          </div>
        ))}
      </Stack>
      <Stack flexDirection="row" sx={{ mt: 3, alignItems: "center" }}>
        {finishedLoading ? (
          <span style={{ color: "#037d5a" }}> Uploaded Successfully! </span>
        ) : (
          <LoadingButton
            size="small"
            sx={{ m: 1, fontWeight: "bold" }}
            variant="contained"
            endIcon={<CloudUploadIcon />}
            onClick={uploadFiles}
            loading={isUploading}
            loadingPosition="end"
            disabled={finishedLoading}
          >
            {isUploading ? "Uploading" : "Upload"}
          </LoadingButton>
        )}

        <Button
          size="small"
          sx={{ m: 1, fontWeight: "bold" }}
          variant="outlined"
          color="error"
          onClick={clearFilesToUpload}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

export default FilesToUpload;
