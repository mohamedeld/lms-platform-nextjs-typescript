import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type CourseParams = {
  params:{
    courseId:string
  }
}

export async function PATCH(req:NextRequest,
  {params}:CourseParams
){
  try{
    const {userId} = await auth();
    if(!userId){
      return new NextResponse("unauthorized",{status:401});
    }
    const {courseId} = params;
    const values = await req.json();
    const course = await db.course.update({
      where:{
        userId,
        id:courseId
      },
      data:{
        ...values
      }
    })
    return NextResponse.json(course)
  }catch(error){
    console.log("[Edit Courses] ",error);
    return new NextResponse("Something went wrong",{status:500})
  }
}