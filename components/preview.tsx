  "use client";

  import "react-quill/dist/quill.bubble.css";
  import { DynamicQuill } from "./DynamicQuill";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

  interface PreviewProps {
    value: string;
  }

  export const Preview = ({ value }: PreviewProps) => {
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
        <DynamicQuill theme="bubble" value={value} readOnly />
    );
  };