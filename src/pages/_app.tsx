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

//  List pages you want to be publicly accessible, or leave empty if
//  every page requires authentication. Use this naming strategy:
//   "/"              for pages/index.js
//   "/foo"           for pages/foo/index.js
//   "/foo/bar"       for pages/foo/bar.js
//   "/foo/[...bar]"  for pages/foo/[...bar].js
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
        {isPublicPage ? <Component {...pageProps} /> : <Authenticated />}
      </ClerkProvider>
    </>
  );
}

export default api.withTRPC(Linky);
