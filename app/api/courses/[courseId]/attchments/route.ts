import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type AttachProps = {
  params:{
    courseId:string;
  }
}

export async function POST(req:NextRequest,{
  params
}:AttachProps){
  try{
    const {userId} = await auth();
    if(!userId){
      return new NextResponse("unauthorized",{status:401})
    }
    const {courseId} = params;
    const {url} = await req.json();

    const courseOwner = await db.course.findUnique({
      where:{
        id:courseId,
        userId
      }
    });
    if(!courseOwner){
      return new NextResponse("Unauthorized",{status:401})
    }
    const attachment = await db.attachment.create({
      data:{
        url,
        name:url?.split("/").pop(),
        courseId
      }
    })

    return NextResponse.json(attachment)
  }catch(error){
    console.log("attachments",error);
    return new NextResponse("Something went wrong",{status:500})
  }
}