import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await verifySession();
  // //console.log('sessionnnnnnn ', session)

  // if (!session) {
  //   redirect("/");
  // }

  return <>{children}</>;
}
