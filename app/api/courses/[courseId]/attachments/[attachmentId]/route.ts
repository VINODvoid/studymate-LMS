import { Course } from '@prisma/client';
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from '@/lib/db';

export async function DELETE (
    req:Request,
    {params}:{params:{courseId:string , attachmentId:string}}
)
{
    try {
        const {userId} = auth();
        if(!userId)
        {
            return new NextResponse("UnAuthorized",{status:401})
        }
        const courseOwner = await db.course.findUnique(
            {
                where:{
                    id:params.courseId,
                    userId:userId
                }
            }
        );
        if(!courseOwner)
        {
            return new NextResponse("UnAuthorized",{status:401})
        }
        const attachment = await db.attachment.delete({
            where:{
                courseId:params.courseId,
                id:params.attachmentId

            }
        });
        return NextResponse.json(attachment)
    } catch (error) {
        console.log("Attachment Id ",error);
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}