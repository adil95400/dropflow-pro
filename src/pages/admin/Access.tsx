import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import supabase from '@/lib/supabase'

export default function AccessControl() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('id, email, banned')
      setUsers(data || [])
    }
    fetchUsers()
  }, [])

  const toggleBan = async (userId: string, current: boolean) => {
    await supabase.from('users').update({ banned: !current }).eq('id', userId)
    setUsers(users.map(u => (u.id === userId ? { ...u, banned: !current } : u)))
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestion des accès</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="text-center border-t">
              <td>{u.email}</td>
              <td>{u.banned ? 'Banni' : 'Actif'}</td>
              <td>
                <Button onClick={() => toggleBan(u.id, u.banned)}>
                  {u.banned ? 'Débloquer' : 'Bloquer'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
