import useStore from '@/store'
import { supabase } from '@/utils/supabase'
import { ChangeEvent } from 'react'
import { useMutation } from 'react-query'

export const useUploadAvatarImg = () => {
  const editedProfile = useStore((state) => state.editedProfile)
  const updateProfile = useStore((state) => state.updateEditedProfile)
  const useMutateUploadAvatarImg = useMutation(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Please select the image file')
      }
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      console.log(fileExt)
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      console.log(filePath)
      const { error } = await supabase.storage
        .from('rta-avatars')
        .upload(filePath, file)
      if (error) throw new Error(error.message)
      updateProfile({ ...editedProfile, avatar_url: filePath })
    },
    {
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )
  return { useMutateUploadAvatarImg }
}
