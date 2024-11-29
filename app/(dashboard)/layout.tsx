import Sidebar from "@/components/Sidebar"

interface IProps{
  children:React.ReactNode
}

const DashboardLayout = ({children}:IProps) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar/>
      </div>
      {children}
    </div>
  )
}

export default DashboardLayout