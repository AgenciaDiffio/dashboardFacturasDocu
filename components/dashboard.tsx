"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { FacturasList } from "@/components/facturas-list"
import { StatsCard } from "@/components/stats-card"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [incomeData, setIncomeData] = useState([])
  const [egressData, setEgressData] = useState([])
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch("/api/facturas")
        const data = await res.json()
        setIncomeData(data.incomes || [])
        setEgressData(data.egresses || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.totalAmount), 0)
  const totalEgress = egressData.reduce((sum, item) => sum + Number(item.totalAmount), 0)

  if (loading) return <div>Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  label="Total de Facturas"
                  value={incomeData.length + egressData.length}
                  icon="file"
                />
                <StatsCard
                  label="Total Ingresos"
                  value={`Gs. ${totalIncome.toLocaleString("es-PY")}`}
                  icon="trending-up"
                  color="green"
                />
                <StatsCard
                  label="Total Egresos"
                  value={`Gs. ${totalEgress.toLocaleString("es-PY")}`}
                  icon="trending-down"
                  color="red"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimas Facturas</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingresos ({incomeData.length})</h3>
                  <FacturasList data={incomeData.slice(0, 5)} type="income" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Egresos ({egressData.length})</h3>
                  <FacturasList data={egressData.slice(0, 5)} type="egress" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ingresos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Todas las Facturas de Ingresos</h2>
            <FacturasList data={incomeData} type="income" />
          </div>
        )}

        {activeTab === "egresos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Todas las Facturas de Egresos</h2>
            <FacturasList data={egressData} type="egress" />
          </div>
        )}
      </main>
    </div>
  )
}
