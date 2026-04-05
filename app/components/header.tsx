import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
return (
<div className="shrink-0 flex items-center justify-between h-12 px-3 bg-[#0f172a] border-b border-slate-800">

      {isMobile

        ? (
<div

            className='flex items-center justify-center h-8 w-8 cursor-pointer'

            onClick={() => onShowSideBar?.()}
>
<Bars3Icon className="h-4 w-4 text-gray-400" />
</div>

        )

        : <div></div>}
<div className='flex items-center space-x-2'>
<img src='/logo.png' className='w-6 h-6' alt='logo' />
<div className="text-sm text-white font-bold tracking-wider uppercase">Ali AlRashed SOC Assistant</div>
</div>

      {isMobile

        ? (
<div className='flex items-center justify-center h-8 w-8 cursor-pointer' onClick={() => onCreateNewChat?.()} >
<PencilSquareIcon className="h-4 w-4 text-gray-400" />
</div>)

        : <div></div>}
</div>

  )
}

export default React.memo(Header)
