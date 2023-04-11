import { Profile } from '@/types'
import { supabase } from '@/utils/supabase'
import { useMutation, useQueryClient } from 'react-query'

export const useMutateProfile = () => {
  const queryClient = useQueryClient()
  const createProfileMutation = useMutation(
    async (profile: Omit<Profile, 'updated_at' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('rta_profiles')
        .insert(profile)
      if (error) throw new Error(error.message)

      return data
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryData(['rta_profile'], res[0])
      },
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  const updateProfileMutation = useMutation(
    async (profile: Omit<Profile, 'updated_at' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('rta_profiles')
        .update(profile)
        .eq('id', profile.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        queryClient.setQueryDefaults(['rta_profile'], res[0])
      },
      onError(err: any) {
        alert(err.message)
      },
    }
  )
  return {
    createProfileMutation,
    updateProfileMutation,
  }
}
