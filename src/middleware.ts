// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: ["/"],
//   debug: true,
// });

// export const config = {
//   matcher: ["/((?!...|_next).)", "/", "/(api|trpc)(.)"],
// };

import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default withClerkMiddleware(() => {
  return NextResponse.next();
});

// Stop Middleware running on static files
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico).*)",
};
