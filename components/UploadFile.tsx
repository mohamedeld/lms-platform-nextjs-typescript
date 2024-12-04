"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/utils/uploadthing";
import toast from "react-hot-toast";

interface UploadFileProps {
  onChange:(url?:string)=>void;
  endpoint:keyof typeof ourFileRouter;
}

const UploadFile = ({onChange,endpoint}:UploadFileProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res)=>{
        onChange(res?.[0]?.url)
      }}
      onUploadError={(error:Error)=>{
        toast.error(error instanceof Error ? error?.message : "Something went wrong")
      }}
    />
  )
}

export default UploadFile