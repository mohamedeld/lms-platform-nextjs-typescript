import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <Image
      src={"/images/logo.svg"}
      width={130}
      height={130}
      alt="logo"
      className='object-cover'
    />
  )
}

export default Logo