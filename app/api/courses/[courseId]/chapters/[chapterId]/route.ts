import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type ChapterParams = {
  params:{
    chapterId:string;
    courseId:string;
  }
}

export async function PATCH(req:NextRequest,{
  params
}:ChapterParams){
  try{
    const {userId} = await auth();
    if(!userId){
      return new NextResponse("unauthorized",{status:401})
    }

    const {courseId,chapterId} = params;
    const {isPublished,...values} = await req.json();

    const courseOwner = await db.course.findUnique({
      where:{
        id:courseId,
        userId
      }
    });
    if(!courseOwner){
      return new NextResponse("Unauthorized",{status:401})
    }

    const chapter = await db.chapter.update({
      where:{
        id:chapterId,
        courseId
      },
      data:{
        ...values
      }
    })
    return NextResponse.json(chapter);
  }catch(error){
    console.log("attachments",error);
    return new NextResponse("Something went wrong",{status:500})
  }
}