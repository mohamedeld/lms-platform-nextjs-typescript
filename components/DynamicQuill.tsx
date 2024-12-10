"use client";

import dynamic from "next/dynamic";

export const DynamicQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});