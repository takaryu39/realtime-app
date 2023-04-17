import { EditedComment } from '@/types'
import { supabase } from '@/utils/supabase'
import { useMutation } from 'react-query'

export const useMutateComment = () => {
  const createCommentMutation = useMutation(
    async (comment: Omit<Comment, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('rta_comments')
        .insert(comment)
      if (error) throw new Error()
      return data
    },
    {
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )
  const updateCommentMutation = useMutation(
    async (comment: EditedComment) => {
      const { data, error } = await supabase
        .from('rta_comments')
        .update({ comment: comment.comment })
        .eq('id', comment.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )
  const deleteCommentMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('rta_comments')
        .delete()
        .eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onError: (err: any) => {
        alert(err.message)
      },
    }
  )

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  }
}
