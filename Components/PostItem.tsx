import { useDownloadUrl } from '@/hooks/useDownloadUrl'
import { useMutatePost } from '@/hooks/useMutatePost'
import useQueryAvatar from '@/hooks/useQueryAvatar'
import useStore from '@/store'
import { Post } from '@/types'
import {
  PencilAltIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/solid'
import Image from 'next/image'
import React, { FC, memo } from 'react'
import { Spinner } from './Spinner'

export const PostItemMemo: FC<Omit<Post, 'created_at'>> = ({
  id,
  title,
  post_url,
  user_id,
}) => {
  const session = useStore((state) => state.session)
  const update = useStore((state) => state.updateEditedPost)
  const { data } = useQueryAvatar(user_id)
  const { deletePostMutation } = useMutatePost()
  const { fullUrl: avatarUrl, isLoading: isLoadingAvatar } = useDownloadUrl(
    data?.avatar_url,
    'rta-avatars'
  )

  const { fullUrl: postUrl, isLoading: isLoadingPost } = useDownloadUrl(
    post_url,
    'rta-posts'
  )

  return (
    <>
      <li className="w-80">
        <div className="my-3 w-full border border-dashed border-gray-400" />
        <div className="flex items-center justify-between">
          <div className="flex">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="avatar"
                className="rounded-full"
                width={25}
                height={25}
              />
            ) : (
              <UserCircleIcon className="inline-block w-8 h-8 cursor-pointer text-gray-500" />
            )}
            <span className="ml-2 font-bold">{title}</span>
          </div>
          {session?.user?.id === user_id && (
            <div className="flex pr-4">
              <PencilAltIcon
                data-testid="pencil-icon"
                className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
                onClick={() => {
                  update({
                    id: id,
                    title: title,
                    post_url: post_url,
                  })
                }}
              />
              <TrashIcon
                data-testid="trash-post"
                className="h-5 w-5 cursor-pointer text-blue-500"
                onClick={() => {
                  deletePostMutation.mutate(id)
                }}
              />
            </div>
          )}
        </div>
        <div className="my-3 flex justify-center">
          {postUrl && (
            <Image
              src={postUrl}
              alt="Image"
              className="rounded-lg"
              width={300}
              height={200}
            />
          )}
        </div>
        <div className="my-3 flex justify-center">
          {(isLoadingAvatar || isLoadingPost) && <Spinner />}
        </div>
      </li>
    </>
  )
}
export const PostItem = memo(PostItemMemo)
