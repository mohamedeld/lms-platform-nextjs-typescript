"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "../ui/button";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";

import { Chapter, Course, MuxData } from "@prisma/client";
import Image from "next/image";
import UploadFile from "../UploadFile";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps  {
  initialData:Chapter & {muxData?:MuxData | null };
  courseId:string;
}
const formSchema = z.object({
  videoUrl:z.string().min(1,{
    message:"video url is required"
  })
});

const ChapterVideoForm = ({initialData:chapter,courseId} :ChapterVideoFormProps) => {
  const [isEditing,setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      videoUrl:chapter?.videoUrl || ""
    },
    mode:'onChange'
  });

  const toggleEditing = ()=>{
    setIsEditing(prev=> !prev);
  }

  const {isSubmitting,isValid} = form.formState;

  const onSubmit = async (values:z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${courseId}/chapters/${chapter?.id}`,values);
      toast.success("Chapter updated successfully");
      toggleEditing();
      router.refresh();
    }catch(error){
      toast.error(error instanceof Error ? error?.message : "Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && (
            <>Cancel</>
          )
        }
        {(!isEditing && !chapter?.videoUrl) && (
          <>
          <PlusCircle className="h-4 w-4 mr-2"/>
          Add a video
          </>
        )}
        {(!isEditing && chapter?.videoUrl) && (
          <>
          <Pencil className="h-4 w-4 mr-2"/>
          Edit Video
          </>
        )}
        </Button>
      </div>
      {
        !isEditing && (
          !chapter?.videoUrl ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <Video className="h-10 w-10 text-slate-500"/>
            </div>
          ): (
            <div className="relative aspect-video mt-2">
             <MuxPlayer playbackId={chapter?.muxData?.playbackId || ''} />
            </div>
          )
        )
      }
      {
        isEditing && (
          <div>
            <UploadFile endpoint="chapterVideo" onChange={(url)=>{
              if(url){
                onSubmit({videoUrl:url})
              }
            }}/>
            <div className="text-xs text-muted-foreground mt-4">
              Upload this chapter's video
            </div>
          </div>
        )
      }
      {
        chapter?.videoUrl && !isEditing && (
          <div className="text-xs text-muted-foreground mt-2">
            Video can take a few minutes to process. Refresh the page if video does not appear.
          </div>
        )
      }
    </div>
  )
}

export default ChapterVideoForm