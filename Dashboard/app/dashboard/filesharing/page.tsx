"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function FilesharingPage() {
  const [loading, setLoading] = useState(false);
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
  const reset = () => {
    setLinks([]);
  };
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-bold">File Sharing</h1>
      <Button onClick={handleShowAll} disabled={loading}>
        {loading ? "Loading..." : "Show All"}
      </Button>
      <div className="flex w-full items-center space-x-2 gap-3">
        <Input type="text" placeholder="Short URL" />
        <Button type="submit">Search</Button>
        {links.length > 0 ? (
          <Button
            type="reset"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={reset}
          >
            Reset
          </Button>
        ) : null}
      </div>
      {links.length > 0 && (
        <div className="w-full mt-4">
          <h2 className="text-lg font-medium mb-2">Results:</h2>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.id} className="border p-3 rounded-lg text-sm">
                <div>
                  <strong>Short URL:</strong> {link.shortUrl}
                </div>
                <div>
                  <strong>Long URL:</strong>{" "}
                  <a
                    href={link.longUrl}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {link.longUrl}
                  </a>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(link.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
