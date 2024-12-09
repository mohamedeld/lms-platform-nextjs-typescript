"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "./ui/button";
import { Pencil, PencilIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Chapter, Course } from "@prisma/client";
import ChapterList from "./ChapterList";


interface ChapterFormProps  {
  initialData:Course & {Chapter:Chapter[]}
}
const formSchema = z.object({
  title:z.string().min(1,{
    message:"chapter title is required"
  })
});

const ChapterForm = ({initialData:course} :ChapterFormProps) => {
  const [isCreating,setIsCreating] = useState(false)
  const [isUpdating,setIsUpdating] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      title:""
    },
    mode:'onChange'
  });

  const toggleCreating = ()=>{
    setIsCreating(!isCreating);
  }

  const {isSubmitting,isValid} = form.formState;

  const onSubmit = async (values:z.infer<typeof formSchema>)=>{
    try{
      await axios.post(`/api/courses/${course?.id}/chapters`,values);
      toggleCreating();
      router.refresh();
      toast.success("Chapter created successfully");
      form?.reset()
    }catch(error){
      toast.error(error instanceof Error ? error?.message : "Something went wrong");
    }
  }
  
  const onReorder = async (updateData:{id:string,position:number}[])=>{
    try{
      setIsUpdating(true);
      await axios.put(`/api/courses/${course?.id}/chapters/reorder`,{
        list:updateData
      });
      toast.success("oredered successfully");
      router.refresh();
    }catch(error){
      toast.error(error instanceof Error ? error?.message : "Something went wrong");
    }finally{
      setIsUpdating(false);
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Chapter
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <>Cancel</>
          ):(
            <>
            <PlusCircle className="h-4 w-4 mr-2"/>
            Add a chapter
            </>
          )}
        </Button>
      </div>
      
      {
        !isCreating && (
          <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder the chapters
          </p>
        )
      }
      {
        !isCreating && (
          <div className={
            cn(
              "text-sm mt-2",
              course?.Chapter?.length ===0 && "text-slate-500 italic"
            )
          }>
           {
            course?.Chapter?.length === 0 && "No Chapters"
           }
           {/* todo add list of chapters */}
           <ChapterList
              onEdit={()=>{}}
              onReorder={onReorder}
              items={course?.Chapter || []}
           />
          </div>
        )
      }
      {
        isCreating && (
          <Form {...form}>
            <form onSubmit={form?.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
              <FormField
                control={form?.control}
                name="title"
                render={({field})=>(
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g Introduction to the course"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
                <Button disabled={!isValid || isSubmitting} type="submit">Create</Button>
            </form>
          </Form>
        )
      }
     
    </div>
  )
}

export default ChapterForm