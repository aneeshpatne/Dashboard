"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

export default function FilesharingPage() {
  const [loading, setLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [newActive, setNewActive] = useState(false);
  const [links, setLinks] = useState<
    { id: string; shortUrl: string; longUrl: string; createdAt: string }[]
  >([]);
  const handleShowAll = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/url");
      const res = await data.json();
      setLinks(res.links);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const searchToggle = () => {
    setLinks([]);
    setNewActive(false);
    setSearchActive((prev) => !prev);
  };
  const addToggle = () => {
    setLinks([]);
    setSearchActive(false);
    setNewActive((prev) => !prev);
  };
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
        <Button onClick={() => searchToggle()}>
          {searchActive ? "Hide Search" : "Search"}
        </Button>
        <Button onClick={() => addToggle()}>
          {!newActive ? <p>Add New Link</p> : <p>Hide New Link</p>}
        </Button>
      </div>
      <div className="flex w-full items-center justify-center space-x-2 gap-3">
        {searchActive ? (
          <>
            <Input type="text" placeholder="Short URL" />
            <Button type="submit">Search</Button>{" "}
          </>
        ) : null}
      </div>
      {links.length > 0 && (
        <div className="w-full mt-4">
          <h2 className="text-lg font-medium mb-2">Results:</h2>
          <ul className="flex gap-3">
            {links.map((link, index) => (
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
  return (
    <li key={id} className="border p-3 rounded-lg text-sm">
      <div>
        <strong>Short URL:</strong> {shortUrl}
      </div>
      <div>
        <strong>Long URL:</strong>{" "}
        <a href={longUrl} target="_blank" className="text-blue-600 underline">
          {longUrl}
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
  const [loading, setLoading] = useState(false);
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
    console.log("to be implemented");
  };

  return (
    <div className="flex flex-col gap-5 w-full items-center justify-center">
      <h1 className="font-bold">Add URL</h1>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="shortURL">Short URL</Label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Short URL"
            id="shortURL"
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
        </div>
      </div>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="w-auto"
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
      <Button type="submit" className="w-auto" variant="default">
        Submit
      </Button>
    </div>
  );
}
