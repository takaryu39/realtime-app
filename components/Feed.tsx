import { userQueryPosts } from '@/hooks/userQueryPosts'
import { useSubscribePosts } from '@/hooks/useSubscribePosts'
import { FC } from 'react'
import { PostForm } from './PostForm'
import { PostItem } from './PostItem'

export const Feed: FC = () => {
  const { data: posts } = userQueryPosts()
  useSubscribePosts()
  return (
    <>
      <p className="mb-4 text-center">Feed</p>
      <PostForm />
      <ul data-testid="ul-post" className="my-5">
        {posts?.map((post) => (
          <PostItem
            key={post.id}
            id={post.id}
            title={post.title}
            post_url={post.post_url}
            user_id={post.user_id}
          />
        ))}
      </ul>
    </>
  )
}
