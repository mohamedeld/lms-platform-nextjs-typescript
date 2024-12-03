import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

interface IProps{
  children:React.ReactNode
}

const DashboardLayout = ({children}:IProps) => {
  return (
    <div className="h-full">
      <div className="md:pl-56 h-[80px] fixed inset-y-0 z-50 w-full">
        <Navbar/>
      </div>
      <div className="hidden md:flex w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar/>
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
      {children}
      </main>
    </div>
  )
}

export default DashboardLayout