import { Post } from '@/types'
import { supabase } from '@/utils/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { SupabaseRealtimeClient } from '@supabase/supabase-js/dist/module/lib/SupabaseRealtimeClient'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

export const useSubscribePosts = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const subsc = supabase
      .from('rta_posts')
      .on('INSERT', (payload: SupabaseRealtimePayload<Post>) => {
        //キャッシュから既存のpostsを取得して末尾にinsertされたpostを追加する
        let previousPosts = queryClient.getQueryData<Post[]>(['rta_posts'])
        if (!previousPosts) {
          previousPosts = []
        }
        queryClient.setQueryData(
          ['rta_posts'],
          [
            ...previousPosts,
            {
              id: payload.new.id,
              created_at: payload.new.created_at,
              title: payload.new.title,
              post_url: payload.new.post_url,
              user_id: payload.new.user_id,
            },
          ]
        )
      })
      .on('UPDATE', (payload: SupabaseRealtimePayload<Post>) => {
        //キャッシュから既存のpostsを取得してmapで展開。idが一致したpostを更新する
        let previousPosts = queryClient.getQueryData<Post[]>(['rta_posts'])
        if (!previousPosts) {
          previousPosts = []
        }
        queryClient.setQueryData(
          ['rta_posts'],
          previousPosts.map((post) =>
            post.id === payload.new.id
              ? {
                  id: payload.new.id,
                  created_at: payload.new.created_at,
                  title: payload.new.title,
                  post_url: payload.new.post_url,
                  user_id: payload.new.user_id,
                }
              : post
          )
        )
      })
      .on('DELETE', (payload: SupabaseRealtimePayload<Post>) => {
        //キャッシュから既存のpostsを取得してfilterで展開。idが一致していないpostだけ返す
        let previousPosts = queryClient.getQueryData<Post[]>(['rta_posts'])
        if (!previousPosts) {
          previousPosts = []
        }
        queryClient.setQueryData(
          ['rta_posts'],
          previousPosts.filter((post) => post.id !== payload.old.id)
        )
      })
      .subscribe()
    const removeSubscription = async () => {
      await supabase.removeSubscription(subsc)
    }
    return () => {
      removeSubscription()
    }
  }, [queryClient])
}
