"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
export default function FilesharingPage() {
  const [loading, setLoading] = useState(false);
  const [newActive, setNewActive] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [links, setLinks] = useState<
    { id: string; shortUrl: string; longUrl: string; createdAt: string }[]
  >([]);
  const [filteredLinks, setFilteredLinks] = useState<
    { id: string; shortUrl: string; longUrl: string; createdAt: string }[]
  >([]);
  const handleShowAll = async () => {
    setLoading(true);
    setNewActive(false);
    try {
      const data = await fetch("/api/url");
      const res = await data.json();
      if (!res.links) {
        console.warn("No links returned", res);
        setLinks([]);
        setFilteredLinks([]);
        return;
      }
      setLinks(res.links);
      setFilteredLinks(res.links);
    } catch (err) {
      setLinks([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addToggle = () => {
    setLinks([]);
    setNewActive((prev) => !prev);
  };
  useEffect(() => {
    if (search === "") {
      setFilteredLinks(links);
    } else {
      const reducedLinks = links.filter((link) =>
        link.shortUrl.includes(search.toLowerCase())
      );
      setFilteredLinks(reducedLinks);
    }
  }, [search]);

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          Quick Share
        </h1>
        <p className="text-muted-foreground">
          Share files and manage your links easily
        </p>
      </div>

      <div className="flex gap-4 items-center justify-center mb-8">
        {links.length === 0 ? (
          <Button
            onClick={handleShowAll}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              "Show All"
            )}
          </Button>
        ) : (
          <Button
            type="reset"
            className="px-6 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-colors"
            onClick={() => setLinks([])}
          >
            Reset
          </Button>
        )}

        <Button
          onClick={() => addToggle()}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-colors"
        >
          {!newActive ? "Add New Link" : "Hide New Link"}
        </Button>
      </div>

      <div className="flex w-full items-center justify-center space-x-2 gap-3"></div>
      {links.length > 0 && (
        <div className="mt-4 ">
          <div className="mx-auto w-[300px]">
            <Input
              type="text"
              placeholder="Short URL"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-5 mt-4 w- mx-auto">
            <h2 className="text-lg font-medium mb-2 text-center">Results</h2>
            {filteredLinks.length === 0 && (
              <p className="text-sm text-muted-foreground">No results found</p>
            )}
            <ul className="flex gap-3 justify-center items-center flex-wrap">
              {filteredLinks.map((link, index) => (
                <DataBox
                  id={index.toString()}
                  key={index}
                  shortUrl={link.shortUrl}
                  longUrl={link.longUrl}
                  createdAt={link.createdAt}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      {newActive ? <LinkBox /> : null}
    </div>
  );
}
type DataBoxProps = {
  id: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
};
function DataBox({ id, shortUrl, longUrl, createdAt }: DataBoxProps) {
  const longUrlDisp = new URL(longUrl).hostname.replace("www.", "");
  const shortUrlRedirect = "https://go.aneeshpatne.com/" + shortUrl;

  return (
    <li
      key={id}
      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 w-[300px]"
    >
      <div className="space-y-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Short URL
          </div>
          <div className="font-medium">{shortUrl}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Original URL
          </div>
          <a
            href={longUrl}
            target="_blank"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {longUrlDisp}
          </a>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <a
            href={shortUrlRedirect}
            target="_blank"
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span className="mr-1">Preview URL</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Created {new Date(createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </li>
  );
}

type Info = {
  status: string;
  longUrl?: string;
  message?: string;
};

function LinkBox() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shortURL, setShortUrl] = useState<string>("");
  const [info, setInfo] = useState<Info>({ status: "" });
  const [uploadInfo, setUploadInfo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [urlType, setUrlType] = useState<string>("file-share");
  const [fileURL, setFileURL] = useState<string>("");
  const [userLongURL, setUserLongURL] = useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };
  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const checker = async () => {
    if (!shortURL) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/url/${shortURL}`);
      const data = await res.json();
      if (res.status === 200) {
        setInfo({
          status: "This Short URL Exists",
          longUrl: data.links.longUrl,
        });
      }
      if (res.status === 404) {
        setInfo({ status: "This Short URL does not exist" });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    const supabase = createClient();
    if (!selectedFile) return;
    setLoadingSubmit(true);
    try {
      const { data, error } = await supabase.storage
        .from("files")
        .upload(`uploads/${shortURL}-${selectedFile.name}`, selectedFile, {
          cacheControl: "3600",
          upsert: true,
        });
      if (error) {
        setUploadInfo("Error uploading file");
        console.log(error);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("files")
        .getPublicUrl(`uploads/${shortURL}-${selectedFile.name}`);

      const publicUrl = publicUrlData.publicUrl;
      await fetch("/api/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortUrl: shortURL, longUrl: publicUrl }),
      });
      console.log("File uploaded successfully:", publicUrl);
      setUploadInfo("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadInfo("Error uploading file");
    } finally {
      setLoadingSubmit(false);
    }
  };
  const pathextractor = (url: string) => {
    if (info?.longUrl) {
      const url = new URL(info.longUrl);
      const pathParts = url.pathname.split("/");
      const publicIndex = pathParts.indexOf("public");
      if (!(publicIndex === -1 || publicIndex + 2 >= pathParts.length)) {
        const filePathParts = pathParts.slice(publicIndex + 2); // skip "public" and "<bucket>"
        return filePathParts.join("/");
      } else {
        return "";
      }
    }
  };
  const handleSubmitUrl = async () => {
    if (info?.longUrl) {
      const path = pathextractor(info.longUrl);
      if (path) {
        handleDelete();
      }
    }
    setLoadingSubmit(true);
    try {
      await fetch("/api/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortUrl: shortURL, longUrl: userLongURL }),
      });
      setUploadInfo("URL shortened successfully");
    } catch (error) {
      setUploadInfo("Error shortening URL");
    } finally {
      setLoadingSubmit(false);
    }
  };
  const handleDelete = async () => {
    if (!fileURL) return;
    const supabase = createClient();
    const { error } = await supabase.storage
      .from("files")
      .remove([`uploads/${fileURL}`]);
    setInfo({ status: "File deleted", longUrl: "" });
    await fetch("/api/url", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortUrl: shortURL }),
    });
    if (error) {
      console.log(error);
    } else {
      setFileURL("");
    }
  };
  useEffect(() => {
    if (info?.longUrl) {
      const path = pathextractor(info.longUrl);
      setFileURL(path || "");
    }
  }, [info?.longUrl]);

  return (
    <div className="flex flex-col gap-6 w-full items-center justify-center max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex gap-2 items-center w-full justify-center">
        <Button
          variant="outline"
          className={`${
            urlType === "file-share"
              ? "border-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
              : "hover:border-blue-500 hover:text-blue-600 active:bg-blue-50 dark:active:bg-blue-950/30"
          } flex-1 max-w-[150px] transition-colors`}
          onClick={() => setUrlType("file-share")}
        >
          File Share
        </Button>
        <Button
          variant="outline"
          className={`${
            urlType === "url-shortener"
              ? "border-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
              : "hover:border-blue-500  active:bg-blue-50 dark:active:bg-blue-950/30"
          } flex-1 max-w-[150px] transition-colors`}
          onClick={() => setUrlType("url-shortener")}
        >
          URL Shortener
        </Button>
      </div>

      <div className="grid w-full items-center gap-3">
        <div className="space-y-2">
          <Label htmlFor="shortURL" className="text-sm font-medium">
            Short URL
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter short URL"
              id="shortURL"
              className="text-base"
              onChange={(e) => setShortUrl(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={checker}
              disabled={loading}
              className="whitespace-nowrap hover:border-blue-500  active:bg-blue-50 dark:active:bg-blue-950/30"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Checking
                </div>
              ) : (
                "Check"
              )}
            </Button>
          </div>
          {info && (
            <div className="flex gap-2 items-center text-sm">
              <span
                className={`${
                  info.status.includes("Exists")
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {info.status}
              </span>
              {info.longUrl && (
                <a
                  href={info.longUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Preview
                </a>
              )}
              {fileURL && (
                <button
                  className="text-red-600 hover:underline"
                  onClick={handleDelete}
                >
                  Delete File
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {urlType === "file-share" ? (
        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-medium">
              Upload File
            </Label>
            <Input
              type="file"
              id="file"
              ref={fileInputRef}
              className="w-full"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleClear}
                className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 active:bg-red-100 dark:hover:bg-red-950/30 dark:active:bg-red-950/50 transition-colors"
              >
                Remove File
              </Button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors"
            onClick={handleSubmit}
            disabled={loadingSubmit || !selectedFile || !shortURL}
          >
            {loadingSubmit ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            ) : (
              "Upload File"
            )}
          </Button>

          {uploadInfo && (
            <p
              className={`text-sm text-center ${
                uploadInfo.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {uploadInfo}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="longURL" className="text-sm font-medium">
              Long URL
            </Label>
            <Input
              placeholder="Enter the URL to shorten"
              id="longURL"
              className="text-base"
              onChange={(e) => setUserLongURL(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors"
            onClick={handleSubmitUrl}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Creating Short URL
              </div>
            ) : (
              "Create Short URL"
            )}
          </Button>
        </div>
      )}
      {uploadInfo && (
        <p
          className={`text-sm text-center ${
            uploadInfo.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {uploadInfo}
        </p>
      )}
    </div>
  );
}
