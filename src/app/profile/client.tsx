"use client";

import { useRouter } from "next/navigation";
import { useSession } from "../../lib/authClient";
import { Header } from "../../components/common/Header";
import { BasicUser } from '../../lib/types';

// Define an extended session type
type BasicSession = {
  user: BasicUser;
};

export function ProfilePageClient() {
  const router = useRouter();
  const { data, isPending } = useSession() as {
    data: BasicSession | null | undefined;
    isPending: boolean;
  };

  // Redirect to login if not authenticated
  if (!isPending && !data) {
    router.push("/auth/sign-in");
    return null;
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="mt-2 text-gray-600">Manage your account information</p>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow">
            <div className="flex flex-col md:flex-row">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center justify-center bg-blue-50 p-8 md:w-1/3">
                {data?.user.image ? (
                  <img
                    src={data.user.image}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-500">
                    {data?.user?.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  {data?.user?.username || "User"}
                </h2>
                <p className="text-sm text-gray-500">{data?.user?.email}</p>
              </div>

              {/* Profile Details Section */}
              <div className="flex-1 p-8">
                <h2 className="mb-6 text-xl font-semibold text-gray-800">
                  Account Information
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Username
                    </label>
                    <p className="mt-1 text-gray-800">{data?.user?.username || "Not set"}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Email Address
                    </label>
                    <p className="mt-1 text-gray-800">{data?.user?.email}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Account Created
                    </label>
                    <p className="mt-1 text-gray-800">
                      {data?.user?.created
                        ? new Date(data.user.created).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Last Updated
                    </label>
                    <p className="mt-1 text-gray-800">
                      {data?.user?.updated
                        ? new Date(data.user.updated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* <div className="mt-8 flex justify-end">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Edit Profile
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white py-6">
        <div className="container mx-auto max-w-4xl px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} VieVlog. All rights reserved.
        </div>
      </footer>
    </div>
  );
}