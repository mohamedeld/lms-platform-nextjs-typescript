"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "./ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";

import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import UploadFile from "./UploadFile";


interface AttachmentFormProps  {
  initialData:Course & { attachments:Attachment[] }
}
const formSchema = z.object({
  url:z.string().min(1,{
    message:"url is required"
  })
});

const AttachmentForm = ({initialData:course} :AttachmentFormProps) => {
  const [isEditing,setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      url:course?.imageUrl || ""
    },
    mode:'onChange'
  });

  const toggleEditing = ()=>{
    setIsEditing(prev=> !prev);
  }

  const {isSubmitting,isValid} = form.formState;

  const onSubmit = async (values:z.infer<typeof formSchema>)=>{
    try{
      await axios.post(`/api/courses/${course?.id}/attchments`,values);
      toast.success("Course updated successfully");
      toggleEditing();
      router.refresh();
    }catch(error){
      toast.error(error instanceof Error ? error?.message : "Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attchments
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && (
            <>Cancel</>
          )
        }
          {(!isEditing ) && (
            <>
            <PlusCircle className="h-4 w-4 mr-2"/>
            Add a file
            </>
          )}
          
        </Button>
      </div>
      {
        !isEditing && (
          <>
            {course?.attachments?.length === 0 && (
              <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>
            )}
          </>
        )
      }
      {
        isEditing && (
          <div>
            <UploadFile endpoint="courseAttachment" onChange={(url)=>{
              if(url){
                onSubmit({url:url})
              }
            }}/>
            <div className="text-xs text-muted-foreground mt-4">
              Add anything your students might need to complete your course
            </div>
          </div>
        )
      }
    </div>
  )
}

export default AttachmentForm