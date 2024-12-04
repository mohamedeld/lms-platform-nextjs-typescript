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

import { Course } from "@prisma/client";
import Image from "next/image";
import UploadFile from "./UploadFile";


interface ImageFormProps  {
  initialData:Course
}
const formSchema = z.object({
  imageUrl:z.string().min(1,{
    message:"image url is required"
  })
});

const ImageForm = ({initialData:course} :ImageFormProps) => {
  const [isEditing,setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      imageUrl:course?.imageUrl || ""
    },
    mode:'onChange'
  });

  const toggleEditing = ()=>{
    setIsEditing(prev=> !prev);
  }

  const {isSubmitting,isValid} = form.formState;

  const onSubmit = async (values:z.infer<typeof formSchema>)=>{
    try{
      await axios.patch(`/api/courses/${course?.id}`,values);
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
        Course Image
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing && (
            <>Cancel</>
          )
        }
          {(!isEditing && !course?.imageUrl) && (
            <>
            <PlusCircle className="h-4 w-4 mr-2"/>
            Add an image
            </>
          )}
          {(!isEditing && course?.imageUrl) && (
            <>
            <Pencil className="h-4 w-4 mr-2"/>
            Edit image
            </>
          )}
        </Button>
      </div>
      {
        !isEditing && (
          !course?.imageUrl ? (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <ImageIcon className="h-10 w-10 text-slate-500"/>
            </div>
          ): (
            <div className="relative aspect-video mt-2">
              <Image
                alt="Upload"
                fill
                className="object-cover rounded-md"
                src={course?.imageUrl}
              />
            </div>
          )
        )
      }
      {
        isEditing && (
          <div>
            <UploadFile endpoint="courseImage" onChange={(url)=>{
              if(url){
                onSubmit({imageUrl:url})
              }
            }}/>
            <div className="text-xs text-muted-foreground mt-4">
              16:9 aspect ratio recommended
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ImageForm