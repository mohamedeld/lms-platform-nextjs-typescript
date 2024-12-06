import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server"


type deleteProps = {
  params:{
    courseId:string;
    attachmentId:string
  }
}

export async function DELETE(req:NextRequest,{
  params
}:deleteProps){
  try{
    const {userId} = await auth();
    if(!userId){
      return new NextResponse("unauthorized",{status:401})
    }
    const {courseId,attachmentId} = params;
    const courseOwner = await db.course.findUnique({
      where:{
        id:courseId,
        userId
      }
    });
    if(!courseOwner){
      return new NextResponse("Unauthorized",{status:401})
    }
    const attachment = await db.attachment.delete({
      where:{
        courseId,
        id:attachmentId
      }
    })
    return NextResponse.json(attachment)
  }catch(error){
    console.log("attachments",error);
    return new NextResponse("Something went wrong",{status:500})
  }
}