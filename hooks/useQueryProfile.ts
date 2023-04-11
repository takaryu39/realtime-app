import useStore from '@/store'
import { Profile } from '@/types'
import { supabase } from '@/utils/supabase'
import { useQuery } from 'react-query'
import { useMutateProfile } from './useMutateProfile'

export const useQueryProfile = () => {
  //stateを取得
  const session = useStore((state) => state.session)
  const editedProfile = useStore((state) => state.editedProfile)
  const update = useStore((state) => state.updateEditedProfile)
  const { createProfileMutation } = useMutateProfile()

  const getProfile = async () => {
    //supabaseからプロフィールの情報を取得する処理（機能）
    const { data, error, status } = await supabase
      .from('rta_profiles')
      .select('*')
      .eq('id', session?.user?.id)
      .single()

    if (error && status === 406) {
      createProfileMutation.mutate({
        id: session?.user?.id,
        username: session?.user?.email,
        favorites: '',
        avatar_url: '',
      })

      update({
        ...editedProfile,
        username: session?.user?.email,
      })
    }
    if (error && status !== 406) {
      throw new Error(error.message)
    }
    return data
  }
  return useQuery<Profile, Error>({
    queryKey: ['rta_profile'],
    queryFn: getProfile,
    staleTime: Infinity,
    onSuccess: (data) => {
      if (data) {
        update({
          username: data.username,
          favorites: data.favorites,
          avatar_url: data.avatar_url,
        })
      }
    },
  })
}
