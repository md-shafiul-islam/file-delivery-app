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
import { v4 as uuidv4 } from "uuid";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadedFileKey, setUploadedFileKey] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState("");

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
    setFileUrl("");
  };

  const uploadFile = async () => {
    if (!file) return;

    setError(""); // Reset errors before upload
    setUploading(true); // Set uploading state
    try {
      //{ headers: REQUEST_HEADER }
      const fileKey = `uploads/${uuidv4()}-${file.name}`;
      const { data } = await axios.post(`${actionUrl}/file/upload-url`, {
        fileKey,
        contentType: file.type,
      });

      if (!data.uploadUrl) {
        console.error("Failed to get signed URL");
        setError("Failed to get signed URL");
        setUploading(false);
        return;
      }

      // Upload file
      const fileUploadResp = await axios.put(data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
          socket.emit("upload-progress", { progress: percent });
        },
      });

      const uploadUrl = fileUploadResp.config.url.split("?")[0];
      console.log("Upload File Response ", uploadUrl);

      setUploading(false); // Reset uploading state

      await saveFileMetadata(fileKey, file.type, uploadUrl, file.name);
      await getSignDownloadUrl(fileKey);
      setDownloadError("");
      setUploadedFileKey(fileKey);
    } catch (error) {
      console.error("Upload error:", error);
      setError("An error occurred while uploading the file.");
      setUploading(false);
    }
  };

  const saveFileMetadata = async (
    fileKey,
    contentType,
    fileUrl,
    originalname
  ) => {
    try {
      await axios.post(`${actionUrl}/file/save-metadata`, {
        fileKey,
        contentType,
        fileUrl,
        originalname,
      });
    } catch (error) {
      console.error("Failed to save file metadata:", error);
    }
  };

  const getSignDownloadUrl = async (fileKey) => {
    const { data } = await axios.post(`${actionUrl}/file/download-url`, {
      fileKey,
    });

    setFileUrl(data.downloadUrl); // Clean URL without query params
  };

  const downloadRangeFile = async () => {
    setDownloading(true);
    setDownloadError("");

    if (!uploadedFileKey) {
      setDownloading(false);
      setDownloadError("File not found. Make sure the file is uploaded.");
      return;
    }

    try {
      const response = await axios.get(`${actionUrl}/file/rang-download`, {
        params: { fileKey: uploadedFileKey },
        responseType: "blob", // Ensure file download
        headers: {
          Range: "bytes=0-", // Request partial content
        },
        onDownloadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setDownloadProgress(percent);
          }
        },
      });

      // Create URL for downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", uploadedFileKey.split("/").pop() || "file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download Error:", err);
      setDownloadError("Failed to download file.");
    }

    setDownloading(false);
  };

  return (
    <div className="grid gap-7">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex flex-row justify-between">
              <div>Upload File</div>
              <div className="w-28 h-11 flex flex-row gap-4 ">
                {!fileUrl ? (
                  <Button
                    disabled={true}
                    variant={"destructive"}
                    className="w-12 h-12"
                  >
                    <Download />
                  </Button>
                ) : (
                  <Link
                    disabled={!fileUrl ? true : false}
                    className={`flex flex-col  items-center justify-center font-bold text-xl bg-green-700 border rounded-md w-12 h-12 `}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download />
                  </Link>
                )}
              </div>
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" onChange={handleFileChange} />

              <Button
                variant="default"
                onClick={uploadFile}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <p>File Upload Progress: </p>
            <div className="flex flex-row justify-between items-center">
              <Progress value={progress} />
              <span>{progress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fast Download File</CardTitle>
          <CardDescription>Optimize download</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5">
            <Button
              className="w-12 h-12"
              variant={"default"}
              disabled={downloading}
              onClick={downloadRangeFile}
              title="Optimize"
            >
              <Download />
            </Button>

            {downloadError && <p className="text-red-500">{downloadError}</p>}

            <p>File Download Progress: </p>
            <div className="flex flex-row justify-between items-center">
              <Progress value={downloadProgress} />
              <span>{downloadProgress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
