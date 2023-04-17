import useStore from '@/store'
import { supabase } from '@/utils/supabase'
import { ExclamationCircleIcon, LogoutIcon } from '@heroicons/react/solid'
import { FC, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryClient } from 'react-query'
import { Feed } from './Feed'
import { Notification } from './Notification'
import { Spinner } from './Spinner'
import { UserProfile } from './UserProfile'

export const DashBoard: FC = () => {
  const queryClient = useQueryClient()
  const resetPost = useStore((state) => state.resetEditedPost)
  const resetProfile = useStore((state) => state.resetEditedProfile)
  const resetNotice = useStore((state) => state.resetEditedNotice)
  const signOut = () => {
    resetPost()
    resetProfile()
    resetNotice()
    supabase.auth.signOut()
    queryClient.removeQueries(['rta_profile'])
    queryClient.removeQueries(['rta_notices'])
    queryClient.removeQueries(['rta_posts'])
  }

  return (
    <>
      <LogoutIcon
        className="my-6 h-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
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

        <div className="flex w-96 flex-col items-center">
          <ErrorBoundary
            fallback={
              <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
            }
          >
            <Suspense fallback={<Spinner />}>
              <Feed />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="flex flex-col items-center">
          <ErrorBoundary
            fallback={
              <ExclamationCircleIcon className="my-5 h-10 w-10 text-pink-500" />
            }
          >
            <Suspense fallback={<Spinner />}>
              <Notification />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </>
  )
}
