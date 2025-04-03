import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      You are authenticated! <InfoIcon />
      <Link href="dashboard/reset-password">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Reset Password
        </button>
      </Link>
    </div>
  );
}
