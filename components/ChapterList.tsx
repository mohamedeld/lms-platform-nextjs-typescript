import { Chapter } from "@prisma/client";

interface IChapterList{
  onEdit:()=>void;
  onReorder:()=> void;
  items:Chapter[]
}

const ChapterList = ({onEdit,onReorder,items}:IChapterList) => {
  return (
    <div>ChapterList</div>
  )
}

export default ChapterList