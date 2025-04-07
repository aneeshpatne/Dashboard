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
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-bold">File Sharing</h1>
      <div className="flex gap-2 items-center justify-center">
        {links.length === 0 ? (
          <Button onClick={handleShowAll} disabled={loading}>
            {loading ? "Loading..." : "Show All"}
          </Button>
        ) : (
          <Button
            type="reset"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => setLinks([])}
          >
            Reset
          </Button>
        )}

        <Button onClick={() => addToggle()}>
          {!newActive ? <p>Add New Link</p> : <p>Hide New Link</p>}
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
  return (
    <li key={id} className="border p-3 rounded-lg text-sm w-[300px]">
      <div>
        <strong>Short URL:</strong> {shortUrl}
      </div>
      <div>
        <strong>Long URL:</strong>{" "}
        <a href={longUrl} target="_blank" className="text-blue-600 underline">
          {longUrlDisp}
        </a>
      </div>
      <div className="text-xs text-muted-foreground">
        Created: {new Date(createdAt).toLocaleString()}
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
    await fetch("/api/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortUrl: shortURL, longUrl: userLongURL }),
    });
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
    <div className="flex flex-col gap-5 w-full items-center justify-center">
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          className={`${urlType === "file-share" ? "border-2 border-white" : ""}`}
          onClick={() => setUrlType("file-share")}
        >
          File Share
        </Button>
        <Button
          variant="outline"
          className={`${urlType === "url-shortener" ? "border-2 border-white" : ""}`}
          onClick={() => setUrlType("url-shortener")}
        >
          Url Shortener
        </Button>
      </div>
      <div className="grid w-sm items-center gap-1.5">
        <Label htmlFor="shortURL">Short URL</Label>
        <div className="flex items-center gap-2 w-[300px]">
          <Input
            type="text"
            placeholder="Short URL"
            id="shortURL"
            className="text-base"
            onChange={(e) => setShortUrl(e.target.value)}
          />
          <Button variant="outline" onClick={checker} disabled={loading}>
            {loading ? "Checking..." : "Check"}
          </Button>
        </div>
        <div className="flex gap-2">
          {info && (
            <p className="text-sm text-muted-foreground">{info.status}</p>
          )}
          {info.longUrl && (
            <a
              href={info.longUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              Preview
            </a>
          )}
          {fileURL && (
            <button
              className="text-red-600 underline text-sm"
              onClick={handleDelete}
            >
              Delete File
            </button>
          )}
        </div>
      </div>

      {urlType === "file-share" ? (
        <>
          <Input
            type="file"
            ref={fileInputRef}
            className="w-[300px]"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                onClick={handleClear}
                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              >
                Remove File
              </Button>
            </div>
          )}
          <Button
            type="submit"
            className="w-auto"
            variant="default"
            onClick={handleSubmit}
            disabled={loadingSubmit || !selectedFile || !shortURL}
          >
            {loadingSubmit ? "Uploading..." : "Upload File"}
          </Button>
          {uploadInfo && (
            <p className="text-sm text-muted-foreground">{uploadInfo}</p>
          )}
        </>
      ) : (
        <>
          <div className="grid w-[300px] items-center gap-1.5">
            <Label htmlFor="longURL">Long URL</Label>
            <Input
              placeholder="Long URL"
              id="longURL"
              className="text-base"
              onChange={(e) => setUserLongURL(e.target.value)}
            ></Input>
          </div>
          <Button className="w-[80px]" onClick={handleSubmitUrl}>
            Submit
          </Button>
        </>
      )}
    </div>
  );
}
