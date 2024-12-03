import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
  try{
    const {userId} = await auth();
    const {title} = await req.json();
    if(!userId){
      return new NextResponse("Unauthorized",{status:401});
    }

    const course = await db.course.create({
      data:{
        userId,
        title
      }
    })
    return NextResponse.json(course);
  }catch(error){
    console.log("[Courses] ",error);
    return new NextResponse("InternalError",{status:500});
  }
}