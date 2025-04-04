import Link from "next/link";
export default function FilesharingPage() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-bold">File Sharing</h1>
      <p className="text-sm text-foreground">
        This is a file sharing page. You can upload and share files here.
      </p>
      <Link
        href="/dashboard/upload"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload File
      </Link>
    </div>
  );
}
