import { Notice } from '@/types'
import { supabase } from '@/utils/supabase'
import { useQuery } from 'react-query'

export const useQueryNotices = () => {
  //supabaseのnoticesからテーブルのすべての要素を取得する
  const getNotices = async () => {
    const { data, error } = await supabase
      .from('rta_notices')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) {
      throw new Error(error.message)
    }
    return data
  }
  return useQuery<Notice[], Error>({
    queryKey: ['rta_notices'],
    queryFn: getNotices,
    staleTime: Infinity,
  })
}
