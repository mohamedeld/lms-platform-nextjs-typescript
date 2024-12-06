"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "./ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
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
  const [deleteId,setDeleteId] = useState<String | null>('')
  const router = useRouter();
  

  const toggleEditing = ()=>{
    setIsEditing(prev=> !prev);
  }


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

  const handleDelete = async(id:string)=>{
    try{
      setDeleteId(id);
      await axios.delete(`/api/courses/${course?.id}/attchments/${id}`);
      toast.success("attacment delete successfully");
      router.refresh();
    }catch(error){
      toast.error(error instanceof Error ? error?.message : "Something went wrong");
    }finally{
      setDeleteId('')
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
            {course?.attachments?.length > 0 && (
              <div className="space-y-2">
                {course?.attachments?.map(attachment=>{
                  return (
                    <div key={attachment?.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                      <File className="h4 w-4 mr-2 flex-shrink-0 "/>
                      <p className="text-sm line-clamp-1">{attachment?.name}</p>
                      {deleteId === attachment?.id &&(
                        <div>
                          <Loader2 className="w-4 h-4 animate-spin ml-auto"/>
                        </div>
                      )}
                      {deleteId !== attachment?.id &&(
                        <button className="ml-auto hover:opacity-75 transition" onClick={()=> handleDelete(attachment?.id)}>
                          <X className="w-4 h-4 "/>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
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