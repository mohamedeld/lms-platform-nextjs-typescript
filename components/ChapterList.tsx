// "use client";
// import { Chapter } from "@prisma/client";
// import { useEffect, useState } from "react";
// import { DragDropContext,Draggable,Droppable, DropResult } from '@hello-pangea/dnd';
// import { cn } from "@/lib/utils";
// import { Grip, Pencil } from "lucide-react";
// import { Badge } from "./ui/badge";

// interface IChapterList{
//   onEdit:(id:string)=>void;
//   onReorder:(updateData:{
//     id:string;
//     position:number
//   }[])=> void;
//   items:Chapter[]
// }

// const ChapterList = ({onEdit,onReorder,items}:IChapterList) => {
//   const [isMounted,setIsMounted] = useState(false);
//   const [chapters,setChapters] = useState(items);
  
//   useEffect(()=>{
//     setIsMounted(true);
//   },[])

//   useEffect(()=>{
//     setChapters(items)
//   },[items])

//   if(!isMounted){
//     return null;
//   }
//   const handleDrangEnd = (result:DropResult)=>{
//     if(!result?.destination){
//       return;
//     }
//     const items = Array.from(chapters);
//     const [reorderedItem] = items?.splice(result?.source?.index,1);
//     items?.splice(result?.source?.index,0,reorderedItem);

//     const startIndex = Math.min(result?.source?.index,result?.destination?.index);

//     const endIndex = Math.max(result?.source?.index,result?.destination?.index);

//     const updatedChapters = items?.slice(startIndex,endIndex+1);
//     setChapters(items)
//     const bulkUpdateData = updatedChapters?.map((chapter)=>({
//       id:chapter?.id,
//       position:items?.findIndex(item=> item?.id === chapter?.id)
//     }))
//     onReorder(bulkUpdateData);
//   }
//   return (
//     <DragDropContext onDragEnd={handleDrangEnd}>
//       <Droppable droppableId="chapters">
//         {(provided)=>(
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             {chapters?.map((chapter,index)=>{
//               return (
//                 <Draggable key={chapter?.id} draggableId={chapter?.id} index={index}>
//                   {(provided)=>(
//                     <div className={cn(
//                       "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mt-4 text-sm",
//                       chapter?.isPublished && "bg-sky-100 border-sky-200 text-sky-700" 
//                     )}
//                       ref={provided?.innerRef}
//                       {...provided?.draggableProps}
//                     >
//                       <div className={
//                         cn(
//                           "px-2 py-4 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
//                           chapter?.isPublished && "border-r-sky-200 hover:bg-sky-200"
//                         )
//                       } {...provided?.dragHandleProps}>
//                         <Grip className="w-5 h-5"/>
//                       </div>
//                       {chapter?.title}
//                       <div className="ml-auto pr-2 flex items-center gap-x-2">
//                         {chapter?.isFree && (
//                           <Badge>
//                             Free
//                           </Badge>
//                         )}
//                         <Badge
//                           className={
//                             cn(
//                               "bg-slate-500",
//                               chapter?.isPublished && "bg-slate-700"
//                             )
//                           }
//                         >
//                           {chapter?.isPublished ? "Published":"Draft"}
//                         </Badge>
//                           <Pencil
//                             onClick={()=>onEdit(chapter?.id)}
//                             className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
//                           />
//                       </div>
//                     </div>

//                   )}
//                 </Draggable>
//               )
//             })}
//             {provided?.placeholder}
//           </div>
//         )}
//       </Droppable>

//     </DragDropContext>
//   )
// }

// export default ChapterList
import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "./ui/badge";

interface ChapterListProps {
  onEdit: (id: string) => void;
  onReorder: (updateData: {
    id: string;
    position: number;
  }[]) => void;
  items: Chapter[];
}

const ChapterList = ({ onEdit, onReorder, items }: ChapterListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result?.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items?.splice(result?.source?.index, 1);
    items?.splice(result?.destination?.index, 0, reorderedItem);

    setChapters(items);

    const startIndex = Math.min(result?.source?.index, result?.destination?.index);
    const endIndex = Math.max(result?.source?.index, result?.destination?.index);

    const updatedChapters = items?.slice(startIndex, endIndex + 1);
    const bulkUpdateData = items?.map((chapter, index) => ({
      id: chapter?.id,
      position: index
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable 
                key={chapter.id} 
                draggableId={chapter.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mt-4 text-sm",
                      chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div 
                      className={cn(
                        "px-2 py-4 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="w-5 h-5" />
                    </div>
                    {chapter.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge>
                          Free
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          chapter.isPublished && "bg-sky-700"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(chapter?.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList