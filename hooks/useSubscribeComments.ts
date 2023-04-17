import { Comment } from '@/types'
import { supabase } from '@/utils/supabase'
import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { useQueryClient } from 'react-query'

export const useSubscribeComments = (postId: string) => {
  const queryClient = useQueryClient()
  useEffect(() => {
    //rta_commentsの行要素でそのidが引数で渡されたidと一致する行要素だけ監視対象にする
    const subsc = supabase
      .from(`rta_comments:post_id=eq.${postId}`)
      .on('INSERT', (payload: SupabaseRealtimePayload<Comment>) => {
        let previousComments = queryClient.getQueryData<Comment[]>([
          'rta_comments',
          postId,
        ])
        if (!previousComments) {
          previousComments = []
        }

        queryClient.setQueryData(
          ['rta_comments', postId],
          [
            ...previousComments,
            {
              id: payload.new.id,
              created_at: payload.new.created_at,
              user_id: payload.new.user_id,
              post_id: payload.new.post_id,
              comment: payload.new.comment,
            },
          ]
        )
      })
      .on('UPDATE', (payload: SupabaseRealtimePayload<Comment>) => {
        let previousComments = queryClient.getQueryData<Comment[]>([
          'rta_comments',
          postId,
        ])
        if (!previousComments) {
          previousComments = []
        }
        queryClient.setQueryData(
          ['rta_comments', postId],
          previousComments.map((comment) =>
            comment.id === payload.new.id
              ? {
                  id: payload.new.id,
                  created_at: payload.new.created_at,
                  user_id: payload.new.user_id,
                  post_id: payload.new.post_id,
                  comment: payload.new.comment,
                }
              : comment
          )
        )
      })
      .on('DELETE', (payload: SupabaseRealtimePayload<Comment>) => {
        let previousComments = queryClient.getQueryData<Comment[]>([
          'rta_comments',
          postId,
        ])
        if (!previousComments) {
          previousComments = []
        }
        queryClient.setQueryData(
          ['rta_comments', postId],
          previousComments.filter((comment) => comment.id !== payload.old.id)
        )
      })
      .subscribe()
    const removeSubscription = async () => {
      await supabase.removeSubscription(subsc)
    }
    return () => {
      removeSubscription()
    }
  }, [queryClient, postId])
}
