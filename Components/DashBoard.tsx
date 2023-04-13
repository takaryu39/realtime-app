import useStore from '@/store'
import { supabase } from '@/utils/supabase'
import { ExclamationCircleIcon, LogoutIcon } from '@heroicons/react/solid'
import { FC, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryClient } from 'react-query'
import { Spinner } from './Spinner'
import { UserProfile } from './UserProfile'

export const DashBoard: FC = () => {
  const queryClient = useQueryClient()
  const resetProfile = useStore((state) => state.resetEditedProfile)
  const signOut = () => {
    resetProfile()
    supabase.auth.signOut()
    queryClient.removeQueries(['rta_profile'])
  }

  return (
    <>
      <LogoutIcon
        className="my-6 h-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <div className="flex flex-col item-center">
        <ErrorBoundary
          fallback={
            <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
          }
        >
          <Suspense fallback={<Spinner />}>
            <UserProfile />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  )
}
