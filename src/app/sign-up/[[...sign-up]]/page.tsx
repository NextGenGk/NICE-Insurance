import { SignUp } from "@clerk/nextjs";
import { AuthBrandPanel } from "@/components/AuthBrandPanel";

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F3F8F9]">
      <AuthBrandPanel />
      <div className="flex items-center justify-center p-6">
        <SignUp />
      </div>
    </div>
  );
}
