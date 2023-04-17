import { useMutateNotice } from '@/hooks/useMutateNotice'
import useStore from '@/store'
import { Notice } from '@/types'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'
import { FC, memo } from 'react'

export const NoticeItemMemo: FC<Omit<Notice, 'created_at'>> = ({
  id,
  content,
  user_id,
}) => {
  const session = useStore((state) => state.session)
  const update = useStore((state) => state.updateEditedNotice)
  const { deleteNoticeMutation } = useMutateNotice()
  return (
    <li className="my-3">
      <span>{content}</span>
      {session?.user?.id === user_id && (
        <div className="float-right ml-20 flex">
          <PencilAltIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              update({
                id: id,
                content: content,
              })
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => deleteNoticeMutation.mutate(id)}
          />
        </div>
      )}
    </li>
  )
}
export const NoticeItem = memo(NoticeItemMemo)
