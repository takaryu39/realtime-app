import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { useMutateComment } from '@/hooks/useMutateComment'
import useQueryAvatar from '@/hooks/useQueryAvatar'
import useStore from '@/store'
import { EditedComment } from '@/types'
import {
  PencilAltIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/solid'
import Image from 'next/image'
import { FC, SetStateAction, memo } from 'react'
type Props = {
  id: string
  comment: string
  user_id: string | undefined
  setEditedComment: React.Dispatch<SetStateAction<EditedComment>>
}

export const CommentItemMemo: FC<Props> = ({
  id,
  comment,
  user_id,
  setEditedComment,
}) => {
  const session = useStore((state) => state.session)
  const { data } = useQueryAvatar(user_id)
  const { deleteCommentMutation } = useMutateComment()
  const { fullUrl: avatarUrl } = useDownloadUrl(data?.avatar_url, 'rta-avatars')

  return (
    <li className="my-3 flex items-center justify-between">
      <div className="flex">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            width={25}
            height={25}
            className="rounded-full"
            alt="avatar"
          />
        ) : (
          <UserCircleIcon className="inline-block w-8 h-8 cursor-pointer text-gray-500" />
        )}
        <span className="mx-1 text-sm">{comment}</span>
      </div>
      {session?.user?.id === user_id && (
        <div className="flex">
          <PencilAltIcon
            data-testid="pencil-comment"
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => setEditedComment({ id: id, comment: comment })}
          />
          <TrashIcon
            data-testid="trash-comment"
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => deleteCommentMutation.mutate(id)}
          />
        </div>
      )}
    </li>
  )
}
export const CommentItem = memo(CommentItemMemo)
