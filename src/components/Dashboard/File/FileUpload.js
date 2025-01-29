"use client";
import React, { useState, useEffect } from "react";
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Clean up socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleFileChange = (e) => {
    if (!e.target.files[0]) {
      return;
    }
    setFile(e.target.files[0]);
    setProgress(0);
  };

  const uploadFile = async () => {
    if (!file) return;

    setError(""); // Reset errors before upload
    setUploading(true); // Set uploading state
    try {
      //{ headers: REQUEST_HEADER }
      const { data } = await axios.get(
        `${actionUrl}/file/upload-url?fileKey=${file.name}`
      );

      console.log("Upload Sign URL ", data);

      if (!data.uploadUrl) {
        console.error("Failed to get signed URL");
        setError("Failed to get signed URL");
        setUploading(false);
        return;
      }

      // Upload file
      await axios.put(data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
          socket.emit("upload-progress", { progress: percent });
        },
      });

      setFileUrl(data.uploadUrl.split("?")[0]); // Clean URL without query params
      setUploading(false); // Reset uploading state
    } catch (error) {
      console.error("Upload error:", error);
      setError("An error occurred while uploading the file.");
      setUploading(false);
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

            <Button variant="default" onClick={uploadFile} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <p>File Upload Progress: </p>
          <div className="flex flex-row justify-between items-center">
            <Progress value={progress} />
            <span>{progress}%</span>
          </div>

          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              Download File
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
