import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";
type ChapterParams = {
  params:{
    chapterId:string;
    courseId:string;
  }
}

const client = new Mux({
  tokenId:process.env.MUX_ID!,
  tokenSecret:process.env.MUX_TOKEN!
})

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

    if(values?.videoUrl){
      const existingMuxData = await db.muxData.findFirst({
        where:{
            chapterId
        }
      });
      if(existingMuxData){
        await client.video.assets.delete(existingMuxData?.assetId)
        await db.muxData.delete({
          where:{
            id:existingMuxData?.id
          }
        })
      }
      const asset = await client.video.assets.create({
        input:[{url:values?.videoUrl}],
        // playback_policy:"public",
        test:false
      })
      console.log("asset ",asset)
      console.log("assetid ",asset?.playback_ids?.[0]?.id)
      await db.muxData.create({
        data:{
          chapterId,
          assetId:asset?.id,
          playbackId:asset?.playback_ids?.[0]?.id,
        }
      })
    }


    return NextResponse.json(chapter);
  }catch(error){
    console.log("attachments",error);
    return new NextResponse("Something went wrong",{status:500})
  }
}