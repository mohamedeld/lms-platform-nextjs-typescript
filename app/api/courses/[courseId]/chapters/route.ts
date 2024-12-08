import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type CreateChapterProps = {
  params:{
    courseId:string;
  }
}
export async function POST(req:NextRequest,{
  params
}:CreateChapterProps){
  try{
    const {userId} = await auth();
    if(!userId){
      return new NextResponse("unauthorized",{status:401})
    }
    const {courseId} = params;
    const {title} = await req.json();
    
    const courseOwner = await db.course.findUnique({
      where:{
        id:courseId,
        userId
      }
    });
    if(!courseOwner){
      return new NextResponse("Unauthorized",{status:401})
    }
    const lastChapter =await db.chapter.findFirst({
      where:{
        courseId,
      },
      orderBy:{
        position:'desc'
      }
    })
    const newPosition = lastChapter ? lastChapter?.position + 1: 1;
    const chapter = await db.chapter.create({
      data:{
        courseId,
        title,
        position:newPosition
      }
    })
    return NextResponse.json(chapter);
  }catch(error){
    console.log("attachments",error);
    return new NextResponse("Something went wrong",{status:500})
  }
}