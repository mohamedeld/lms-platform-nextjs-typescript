"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Button } from "./ui/button";
import { Pencil, PencilIcon } from "lucide-react";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { cn } from "@/lib/utils";
import { CustomCombox } from "./CustomCombox";


interface CategoryFormProps  {
  initialData:Course;
  options:{
    label:string;
    value:string;
  }[]
}
const formSchema = z.object({
  categoryId:z.string().min(1,{
    message:"category id is required"
  })
});

const CategoryForm = ({initialData:course,options} :CategoryFormProps) => {
  const [isEditing,setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      categoryId: course?.categoryId || ""
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
  const selectedOption = options?.find(item=> item?.value === course?.categoryId);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            <>Cancel</>
          ):(
            <>
            <Pencil className="h-4 w-4 mr-2"/>
            Edit Category
            </>
          )}
        </Button>
      </div>
      {
        !isEditing && (
          <p className={
            cn(
              "text-sm mt-2",
              !course?.categoryId && "text-slate-500 italic"
            )
          }>
            {selectedOption?.label || "No category"}
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
                name="categoryId"
                render={({field})=>(
                  <FormItem>
                    <FormControl>
                      <CustomCombox
                        options={options}
                        value={field?.value}
                        onChange={field?.onChange}
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

export default CategoryForm