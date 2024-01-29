import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/api", "/api/upload", "/api/uploadthing"],
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
