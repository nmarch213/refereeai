"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export default function SignInButton() {
  const handleSignIn = () => {
    void signIn("google");
  };

  return (
    <Button variant="outline" onClick={handleSignIn} className="w-full">
      <Image
        src="https://developers.google.com/static/identity/images/g-logo.png"
        alt="Google logo"
        width={20}
        height={20}
        className="mr-2"
      />
      Sign in with Google
    </Button>
  );
}
