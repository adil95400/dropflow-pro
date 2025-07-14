import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart } from '@/components/ui/chart'
import supabase from '@/lib/supabase'

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.rpc('get_user_stats')
      if (!error) setStats(data)
    }
    fetchData()
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Statistiques Utilisateurs</h2>
      <Card>
        <CardContent>
          <BarChart
            data={stats}
            xField="date"
            yField="active_users"
            label="Utilisateurs actifs / jour"
          />
        </CardContent>
      </Card>
    </div>
  )
}
