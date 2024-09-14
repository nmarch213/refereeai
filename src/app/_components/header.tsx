import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import WhistleLogo from "./whistle-logo";

export async function Header() {
  const session = await getServerAuthSession();

  return (
    <header className="flex h-14 items-center justify-between px-4 lg:px-6">
      <Link className="flex items-center justify-center gap-4" href="#">
        <WhistleLogo className="h-8 w-8" />
        <span className="font-bold">Referee AI</span>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-6">
        {session ? (
          <>
            <Link
              className="text-sm font-medium underline-offset-4 hover:underline"
              href="/"
            >
              Dashboard
            </Link>
            <Link
              href="/api/auth/signout"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign out
            </Link>
          </>
        ) : (
          <>
            <Link
              className="text-sm font-medium underline-offset-4 hover:underline"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium underline-offset-4 hover:underline"
              href="#testimonials"
            >
              Testimonials
            </Link>
            <Link
              className="text-sm font-medium underline-offset-4 hover:underline"
              href="#pricing"
            >
              Pricing
            </Link>
            <Link
              href="/api/auth/signin"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign in
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
