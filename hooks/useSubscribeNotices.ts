import { Notice } from '@/types'
import { supabase } from '@/utils/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

export const useSubscribeNotices = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    //rta_noticesの変更タイプに応じて処理をわける

    const subsc = supabase
      .from('rta_notices')
      .on('INSERT', (payload: SupabaseRealtimePayload<Notice>) => {
        //insertしたときにreactQueryの値を更新する処理
        let previousNotices = queryClient.getQueryData<Notice[]>([
          'rta_notices',
        ])
        if (!previousNotices) {
          previousNotices = []
        }
        //キャッシュされているnoticeの末尾に新しくinsertしたnoticeを追加する
        queryClient.setQueryData(
          ['rta_notices'],
          [
            ...previousNotices,
            {
              id: payload.new.id,
              created_at: payload.new.created_at,
              content: payload.new.content,
              user_id: payload.new.user_id,
            },
          ]
        )
      })
      .on('UPDATE', (payload: SupabaseRealtimePayload<Notice>) => {
        //insertしたときにreactQueryの値を更新する処理
        let previousNotices = queryClient.getQueryData<Notice[]>([
          'rta_notices',
        ])
        if (!previousNotices) {
          previousNotices = []
        }
        //既存のキャッシュの要素をmapで展開し、渡されたidと一致していればupdateする。一致してなければそのまま返す
        queryClient.setQueryData(
          ['rta_notices'],
          previousNotices.map((notice) =>
            notice.id === payload.new.id
              ? {
                  id: payload.new.id,
                  created_at: payload.new.created_at,
                  content: payload.new.content,
                  user_id: payload.new.user_id,
                }
              : notice
          )
        )
      })
      .on('DELETE', (payload: SupabaseRealtimePayload<Notice>) => {
        //insertしたときにreactQueryの値を更新する処理
        let previousNotices = queryClient.getQueryData<Notice[]>([
          'rta_notices',
        ])
        if (!previousNotices) {
          previousNotices = []
        }
        //既存のキャッシュの要素をfilterしてdeleteされたnoticeのidと一致していない要素だけ返す
        queryClient.setQueryData(
          ['rta_notices'],
          previousNotices.filter((notice) => notice.id !== payload.old.id)
        )
      })
      .subscribe()
    const removeSubscription = async () => {
      await supabase.removeSubscription(subsc)
    }
    return () => {
      //アンマウントされたら監視を終了する
      removeSubscription()
    }
  }, [queryClient]) //キャッシュが更新されるたびに呼び出す
}
