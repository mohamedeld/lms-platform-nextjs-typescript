"use client";

import "react-quill/dist/quill.snow.css";
import { DynamicQuill } from "./DynamicQuill";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>
      <Loader2/>
    </div>;
  }

  return (
    <div className="bg-white">
       <DynamicQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};
