import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type UpdateChapterOrderProps = {
  params:{
    courseId:string;
  }
}
export async function PUT(req:NextRequest,{
  params
}:UpdateChapterOrderProps){
  try{
    const {userId} = await auth();
    if(!userId){
      return new NextResponse("unauthorized",{status:401})
    }

    const {courseId} = params;
    const {list} = await req.json();
    
    const courseOwner = await db.course.findUnique({
      where:{
        id:courseId,
        userId
      }
    });
    if(!courseOwner){
      return new NextResponse("Unauthorized",{status:401})
    }
    for(let item of list){
      await db.chapter.update({
        where:{
          id:item?.id
        },
        data:{
          position:item?.position
        }
      })
    }
    
    return new NextResponse("Success",{status:200});
  }catch(error){
    console.log("attachments",error);
    return new NextResponse("Something went wrong",{status:500})
  }
}