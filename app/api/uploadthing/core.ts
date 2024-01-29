import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";

const f = createUploadthing();

const handleAuth = () => {
    const {userId} = auth();
    if (!userId) throw new Error("UnAuthorized")
    return {userId};
}; 

export const ourFileRouter = {
	courseImage : f({image:{maxFileSize:"4MB",maxFileCount:1}})
    .middleware(() => handleAuth())
    .onUploadComplete(()=> {}),
    courseAttachment : f(["text","image","video","audio"])
    .middleware(() => handleAuth())
    .onUploadComplete(()=> {}),

    chapterVideo :f({video :{maxFileSize:"512GB",maxFileCount:1}})
    .middleware(() => handleAuth())
    .onUploadComplete(()=>{})

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
