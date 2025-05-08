import { createClient } from "@/utils/supabase/server";
import { Upload, KeyRound } from "lucide-react";
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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Welcome to Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="dashboard/filesharing" className="group">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Upload className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Quick Access
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors">
                QuickShare
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Securely share files and collaborate with others in real-time
              </p>
            </div>
          </Link>

          <Link href="dashboard/reset-password" className="group">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <KeyRound className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Security
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors">
                Reset Password
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Update your password and manage account security settings
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
