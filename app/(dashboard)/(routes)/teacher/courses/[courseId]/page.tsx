import AttachmentForm from "@/components/AttachmentForm";
import CategoryForm from "@/components/CategoryForm";
import DescriptionForm from "@/components/DescriptionForm";
import IconBade from "@/components/IconBade";
import ImageForm from "@/components/ImageForm";
import PriceForm from "@/components/PriceForm";
import TitleForm from "@/components/TitleForm";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";

type CourseDetailsProps = {
  params:{
    courseId:string
  }
}

const CourseDetailsPage = async ({params}:CourseDetailsProps) => {
  const {userId} = await auth();
  if(!userId){
    return redirect("/")
  }
  const {courseId} = params;
  const course = await db.course.findUnique({
    where:{
      id:courseId,
      userId
    },
    include:{
      attachments:{
        orderBy:{
          createdAt:'desc'
        }
      }
    }
  })
  if(!course){
    return redirect("/")
  }
  const categories = await db.category.findMany({
    orderBy:{
      name:'asc'
    }
  })

  const requiredFields = [
    course?.title,
    course?.description,
    course?.imageUrl,
    course?.price,
    course?.categoryId
  ]
  const totalFields = requiredFields?.length;
  const completedFields = requiredFields?.filter(Boolean)?.length;

  const completedText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">Complete all fields {completedText}</span>

        </div>  
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBade icon={LayoutDashboard}/>
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course}/>
          <DescriptionForm initialData={course}/>
          <ImageForm initialData={course}/>
          <CategoryForm initialData={course} options={
            categories?.map(category=>({
              label:category?.name,
              value:category?.id,
            }))
          }/>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBade icon={ListChecks}/>
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <div>
              TODO Chapters
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBade icon={CircleDollarSign}/>
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course}/>
          </div>
          <div>
          <div className="flex items-center gap-x-2">
              <IconBade icon={File}/>
              <h2 className="text-xl">Resources & Attachments</h2>
            </div>
            <AttachmentForm initialData={course}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailsPage