import { Profile } from '@/types'
import { supabase } from '@/utils/supabase'
import { useQuery } from 'react-query'

const useQueryAvatar = (userId: string | undefined) => {
  const getAvatarUrl = async () => {
    const { data, error } = await supabase
      .from('rta_profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single()
    if (error) throw new Error(error.message)
    return data
  }
  return useQuery<Profile, Error>({
    queryKey: ['rta_avatar', userId],
    queryFn: getAvatarUrl,
    refetchOnWindowFocus: true,
  })
}

export default useQueryAvatar
