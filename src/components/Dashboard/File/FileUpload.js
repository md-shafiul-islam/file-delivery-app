"use client";
import React, { useState } from "react";

import axios from "axios";
import io from "socket.io-client";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actionUrl = `${process.env.NEXT_PUBLIC_API_LINK}`;

const socket = io(actionUrl);
import { REQUEST_HEADER } from "@/utils/types";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    console.log("handleFileChange, ", e.target.files);
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    console.log("uploadFile, ", file);
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      REQUEST_HEADER["Content-Type"] = "multipart/form-data";
      console.log("Header ", REQUEST_HEADER);

      const response = await axios.post(`${actionUrl}/file/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
          socket.emit("upload-progress", { progress: percent });
        },
      });

      setFileUrl(response.data.fileUrl);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const getSignedUrl = async (fileKey) => {
    try {
      const response = await axios.get(
        `${actionUrl}/file/signed-url?fileKey=${fileKey}`,
        { headers: REQUEST_HEADER }
      );
      setFileUrl(response.data.signedUrl);
    } catch (error) {
      console.error("Error fetching signed URL:", error);
    }
  };

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file" onChange={handleFileChange} />

            <Button variant="default" onClick={uploadFile}>
              Upload
            </Button>
          </div>

          <p>File Upload Progress: </p>
          <div className="flex flex-row justify-between items-center">
            <Progress value={progress} />
            <span>{progress}%</span>
          </div>

          {fileUrl && (
            <a href={fileUrl} target="_blank">
              Download File
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
