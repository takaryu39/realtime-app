import { useMutateAuth } from '@/hooks/useMutateAuth'
import { FC, FormEvent, useState } from 'react'
import { BadgeCheckIcon, ShieldCheckIcon } from '@heroicons/react/solid'

export const Auth: FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  } = useMutateAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      loginMutation.mutate()
    } else {
      registerMutation.mutate()
    }
  }
  return (
    <>
      <ShieldCheckIcon className="mb-8 h-12 w-12 text-blue-500" />
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            required
            className="my-2 rounded border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <div>
          <input
            type="password"
            required
            className="my-2 rounded border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <div className="my-6 flex items-center justify-center text-sm">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="rounded border border-indigo-500 py-3 px-3 font-bold text-indigo-500 transition-all hover:bg-indigo-500 hover:text-white"
          >
            Change Mode ?
          </button>
        </div>
        <button
          type="submit"
          className="relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <BadgeCheckIcon className="h-5 w-5" />
          </span>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
    </>
  )
}
