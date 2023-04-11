import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'

export const useDownloadUrl = (
  filePath: string | undefined,
  key: 'rta_avatars' | 'rta_posts'
) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fullUrl, setFullUrl] = useState('')
  const bucketName = key === 'rta_avatars' ? 'rta_avatars' : 'rta_posts'
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
