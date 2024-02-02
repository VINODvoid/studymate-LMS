import { MuxData } from '@prisma/client';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{courseId:string, chapterId:string}}
)
{
    try {
        const {userId} = auth();
        if (!userId)
        {
            return new NextResponse("UnAuthorized",{status:401})
        }
        const ownCourse = await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            }
        });
        if (!ownCourse)
        {
            return new NextResponse("UnAuthorized",{status:401})
        }
        
        

        const UnpublishedChapter = await db.chapter.update(
            {
                where:{
                    id:params.chapterId,
                    courseId:params.courseId
                },
                data:{
                    isPublished:false,
                }
            }
        );
        const publishedChaptersInCourse = await db.chapter.findMany({
            where:{
                courseId:params.courseId,
                isPublished:true,
            }
        });
        if (!publishedChaptersInCourse)
        {
            await db.course.update({
                where:{
                    id:params.courseId,
                },
                data:{
                    isPublished:false,
                }

            })
        }
        return NextResponse.json(UnpublishedChapter);
    } catch (error) {
        console.log("[Chapter Unpublish]",error);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}