import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'

export const useDownloadUrl = (
  filePath: string | undefined,
  key: 'rta-avatars' | 'rta-posts'
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fullUrl, setFullUrl] = useState('')
  const bucketName = key === 'rta-avatars' ? 'rta-avatars' : 'rta-posts'
  useEffect(() => {
    if (filePath) {
      const download = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(filePath)
        if (error) {
          setIsLoading(false)
          throw error
        }
        setFullUrl(URL.createObjectURL(data!))
        setIsLoading(false)
      }
      download()
    }
  }, [filePath, bucketName])
  return { isLoading, fullUrl, setFullUrl }
}
