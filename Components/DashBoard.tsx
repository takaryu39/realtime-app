import { supabase } from '@/utils/supabase'
import { LogoutIcon } from '@heroicons/react/solid'
import { FC } from 'react'

export const DashBoard: FC = () => {
  const signOut = () => {
    supabase.auth.signOut()
  }
  return (
    <div>
      <LogoutIcon
        className="my-6 h-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
    </div>
  )
}
