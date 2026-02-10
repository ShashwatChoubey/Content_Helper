import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const isAuthRoute = pathname === "/app/sign-in" || pathname === "/app/sign-up";
  
  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    redirect("/app/speech-synthesis/text-to-speech");
  }
  
  // Redirect unauthenticated users to sign-in
  if (!session && !isAuthRoute) {
    redirect(`/app/sign-in?callbackUrl=${pathname}`);
  }

  return <>{children}</>;
}
