"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "./ui/button";
import { Pencil, PencilIcon } from "lucide-react";
import { useState } from "react";


interface TitleFormProps  {
  initialData:{
    title:string;
    id:string;
}
}
const formSchema = z.object({
  title:z.string().min(1,{
    message:"title is required"
  })
});

const TitleForm = ({initialData:course} :TitleFormProps) => {
  const [isEditing,setIsEditing] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:course,
    mode:'onChange'
  });

  const toggleEditing = ()=>{
    setIsEditing(prev=> !prev);
  }

  const {isSubmitting,isValid} = form.formState;

  const onSubmit = async (values:z.infer<typeof formSchema>)=>{
    try{
      console.log(values);
    }catch(error){
      toast.error(error instanceof Error ? error?.message : "Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course title
        <Button>
          <Pencil className="h-4 w-4 mr-2"/>
          Edit Title
        </Button>
      </div>
    </div>
  )
}

export default TitleForm