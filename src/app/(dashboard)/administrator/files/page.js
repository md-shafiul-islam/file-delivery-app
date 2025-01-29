import FileUpload from "@/components/Dashboard/File/FileUpload";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <h2>Welcome to the Files</h2>
      <FileUpload />
    </div>
  );
}
