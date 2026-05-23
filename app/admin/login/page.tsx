import { redirect } from "next/navigation";

/** Admin login lives on the homepage only */
export default function AdminLoginRedirect() {
  redirect("/?admin=1");
}
