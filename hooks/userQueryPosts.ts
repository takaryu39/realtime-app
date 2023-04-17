import { Post } from '@/types'
import { supabase } from '@/utils/supabase'
import { useQuery } from 'react-query'

export const userQueryPosts = () => {
  const getPosts = async () => {
    const { data, error } = await supabase
      .from('rta_posts')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) {
      throw new Error(error.message)
    }
    return data
  }
  return useQuery<Post[], Error>({
    queryKey: ['rta_posts'],
    queryFn: getPosts,
    staleTime: Infinity,
  })
}
