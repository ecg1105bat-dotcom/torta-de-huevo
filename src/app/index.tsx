import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import Auth from '../lib/modules/users/presentation/components/Auth'
import UsersView from '../lib/modules/users/presentation/UsersView'

export default function HomeScreen(){
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  // Aqui esta el cambio

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>
  }

  // Si NO hay sesión -> te muestra tu foto 2 (Email/Password)
  // Si SÍ hay sesión -> te muestra tu foto 1 (No Image / Upload)
  if (!session) {
    return <Auth />
  }

  return <UsersView />
}