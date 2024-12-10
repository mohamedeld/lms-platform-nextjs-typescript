"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "../ui/button";
import { Pencil, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Chapter } from "@prisma/client";
import { Editor } from "../editor";

interface ChapterDescriptionProps  {
  initialData:Chapter;
  courseId:string;
}
const formSchema = z.object({
  description:z.string().min(1,{
    message:"description is required"
  })
});

const ChapterDescription = ({initialData:chapter,courseId} :ChapterDescriptionProps) => {
  const [isEditing,setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      description :chapter?.description || ''
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
        Chapter Description
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ):(
            <>
            <Pencil className="h-4 w-4 mr-2"/>
            Edit Description
            </>
          )}
        </Button>
      </div>
      {
        !isEditing && (
          <p className={cn(
            !chapter?.description && "text-slate-700 italic"
          )}>
           {chapter?.description || "No Description"}
          </p>
        )
      }
      {
        isEditing && (
          <Form {...form}>
            <form onSubmit={form?.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
              <FormField
                control={form?.control}
                name="description"
                render={({field})=>(
                  <FormItem>
                    <FormControl>
                      {/* <Editor
                        {...field}
                      /> */}
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="e.g this chapter is about..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
              </div>
            </form>
          </Form>
        )
      }
    </div>
  )
}

export default ChapterDescription