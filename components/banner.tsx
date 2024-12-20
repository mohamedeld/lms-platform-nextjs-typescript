import { cva, VariantProps } from "class-variance-authority"

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants:{
      variant:{
        warning:"bg-yellow-200/80 border-yellow-30 text-primary",
        success:"bg-emerald-700 border-emerald-800 text-secondary"
      }
    },
    defaultVariants:{
      variant:"warning"
    }
  }
)

interface BannerProps extends VariantProps<typeof bannerVariants>{
  label:string;
}


const Banner = ({label,variant}:BannerProps) => {
  return (
    <div>Banner</div>
  )
}

export default Banner