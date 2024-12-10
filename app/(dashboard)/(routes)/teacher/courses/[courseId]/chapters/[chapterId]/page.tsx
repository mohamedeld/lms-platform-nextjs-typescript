import ChapterForm from "@/components/ChapterForm";
import ChapterAccessForm from "@/components/chapters/ChapterAccessForm";
import ChapterDescription from "@/components/chapters/ChapterDescription";
import ChapterTitle from "@/components/chapters/ChapterTitle";
import IconBade from "@/components/IconBade";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type ChapterDetailsProps = {
  params:{
    chapterId:string;
    courseId:string;
  }
}

const ChapterDetailsPage = async ({params}:ChapterDetailsProps) => {
  const {chapterId,courseId} = params;
  const {userId} = await auth();
  if(!userId){
    return redirect("/");
  }
  const chapter = await db.chapter.findUnique({
    where:{
      id:chapterId,
      courseId,
    },
    include:{
      muxData:true
    }
  });

  if(!chapter){
    return redirect("/");
  }
  const requiredFields = [
    chapter?.title,
    chapter?.description,
    chapter?.videoUrl
  ];
  const totalFields = requiredFields?.length;
  const completedFields = requiredFields?.filter(Boolean)?.length;
  
  const completionText = `(${completedFields})/(${totalFields})`;


  return (
    <div className="p-6">
      <div className="flex items-center justify-between ">
        <div className="w-full">
          <Link href={`/teacher/courses/${courseId}`} className="flex items-center text-sm hover:opacity-75 transition mb-6">
          <ArrowLeft className="h-4 w-4 mr-2"/>
          Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>

            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4 ">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBade icon={LayoutDashboard}/>
              <h2 className="text-xl ">Customize your chapter</h2>
            </div>
            {/* Chapter title form */}
            <ChapterTitle
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterDescription
              initialData={chapter}
              courseId={courseId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBade icon={Eye}/>
              <h2 className="text-xl">Access settings</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterDetailsPage