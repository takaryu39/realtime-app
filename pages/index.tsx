import { NextPage } from 'next'
import useStore from '@/store'
import { Layout } from '@/components/Layout'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { Auth } from '@/components/Auth'
import { DashBoard } from '@/components/DashBoard'

const Home: NextPage = () => {
  const session = useStore((state) => state.session)
  const setSession = useStore((state) => state.setSession)
  useEffect(() => {
    setSession(supabase.auth.session()) //ログイン状態を更新関数に渡す
    supabase.auth.onAuthStateChange((_event, session) => {
      //ログイン状態の変更を検知して変更があったら更新関数に変更後のログイン状態を渡す
      setSession(session)
    })
  }, [setSession]) //更新関数が更新されるたびに発火

  return (
    <Layout title="Dashboard">{!session ? <Auth /> : <DashBoard />}</Layout>
  )
}

export default Home
