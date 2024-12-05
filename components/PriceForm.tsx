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
  import { cn } from "@/lib/utils";
  import { Textarea } from "./ui/textarea";
  import { Course } from "@prisma/client";
  import { formatPrice } from "@/lib/format";


  interface PriceFormProps  {
    initialData:Course
  }
  const formSchema = z.object({
    price:z.coerce.number()
  });

  const PriceForm = ({initialData:course} :PriceFormProps) => {
    const [isEditing,setIsEditing] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver:zodResolver(formSchema),
      defaultValues:{
        price:course?.price || 0
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
          Course Price
          <Button variant="ghost" onClick={toggleEditing}>
            {isEditing ? (
              <>Cancel</>
            ):(
              <>
              <Pencil className="h-4 w-4 mr-2"/>
              Edit Price
              </>
            )}
          </Button>
        </div>
        {
          !isEditing && (
            <p className={cn(
              !course?.price && "text-slate-700 italic"
            )}>
            {course?.price ? formatPrice(course?.price) : "No Price"}
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
                  name="price"
                  render={({field})=>(
                    <FormItem>
                      <FormControl>
                        <Input
                        type="number"
                        step="0.01"
                          disabled={isSubmitting}
                          placeholder="Set a price to your course"
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

  export default PriceForm