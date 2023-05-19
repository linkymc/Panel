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
import { Toaster } from "react-hot-toast";

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

  return (
    <>
      <ClerkProvider
        // note to self, this is hardcoded since Docker likes to complain
        publishableKey="pk_test_dGlnaHQtYmFzcy03LmNsZXJrLmFjY291bnRzLmRldiQ"
        {...pageProps}
        appearance={{
          baseTheme: dark,
        }}
      >
        <Toaster />
        {isPublicPage ? <Component {...pageProps} /> : <Authenticated />}
      </ClerkProvider>
    </>
  );
}

export default api.withTRPC(Linky);
