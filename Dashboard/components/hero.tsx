import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex flex-col gap-5 items-center">
        <h1 className="text-4xl font-bold text-center">Got Lost ?</h1>
        <p className="text-sm text-muted-foreground text-center">
          To contact me or to know more about me, visit
          <a
            href="https://www.aneeshpatne.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500"
          >
            {" "}
            aneeshpatne.com
          </a>
        </p>
      </div>
      <div className="flex gap-5 items-center">
        <NextLogo />
        <SupabaseLogo />
      </div>
    </div>
  );
}
