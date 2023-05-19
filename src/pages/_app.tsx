import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { dark } from "@clerk/themes";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";
import constants from "~/constants";
import { useEffect } from "react";
import Link from "next/link";

const publicPages: Array<string> = ["/", "/test"];

function Linky({ Component, pageProps }: AppProps) {
  // Get the pathname
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  const Authenticated = () => {
    return (
      <>
        <SignedIn>
          <Component {...pageProps} />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  };

  useEffect(() => {
    toast.custom(
      <div className="h-auto w-auto rounded-lg bg-white px-8 py-4 text-center text-gray-700 ">
        <div>Welcome to the public beta!</div>
        <div>
          If you encounter any problems, open an{" "}
          <Link passHref href="https://github.com/linkymc/Panel">
            <a className="underline">issue</a>.
          </Link>{" "}
        </div>
      </div>,
      {
        duration: Infinity,
        position: "bottom-center",
        id: "beta",
      }
    );
  }, []);

  return (
    <ClerkProvider
      // note to self, this is hardcoded since Docker likes to complain
      publishableKey={constants.PUBLISHABLE_KEY}
      {...pageProps}
      appearance={{
        baseTheme: dark,
      }}
    >
      <Toaster />
      {isPublicPage ? <Component {...pageProps} /> : <Authenticated />}
    </ClerkProvider>
  );
}

export default api.withTRPC(Linky);
