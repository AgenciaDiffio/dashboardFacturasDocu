"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { FacturasList } from "@/components/facturas-list"
import { StatsCard } from "@/components/stats-card"
import { LogsList } from "@/components/logs-list"
import { UploadFacturaButton } from "@/components/upload-factura-button"
import type { Income, Egress } from "@/lib/types"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [incomeData, setIncomeData] = useState<Income[]>([])
  const [egressData, setEgressData] = useState<Egress[]>([])
  const [logsData, setLogsData] = useState([])
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/facturas")
      const data = await res.json()
      setIncomeData(data.incomes || [])
      setEgressData(data.egresses || [])
      setLogsData(data.logs || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toNumber = (value: unknown) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0
    if (value === null || value === undefined) return 0
    const cleaned = String(value).replace(/\./g, "").replace(",", ".")
    const num = Number(cleaned)
    return Number.isNaN(num) ? 0 : num
  }

  const totalIncome = incomeData.reduce((sum, item) => sum + toNumber((item as Record<string, unknown>)["ven_totfac"]), 0)
  const totalEgress = egressData.reduce((sum, item) => sum + toNumber((item as Record<string, unknown>)["com_totfac"]), 0)

  if (loading) return <div>Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div></div>
          <UploadFacturaButton onUpload={fetchData} />
        </div>

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
                  <FacturasList data={incomeData.slice(0, 5)} type="income" variant="summary" onUpdate={fetchData} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Egresos ({egressData.length})</h3>
                  <FacturasList data={egressData.slice(0, 5)} type="egress" variant="summary" onUpdate={fetchData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ingresos" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Todas las Facturas de Ingresos</h2>
            </div>
            <FacturasList data={incomeData} type="income" variant="full" onUpdate={fetchData} />
          </div>
        )}

        {activeTab === "egresos" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Todas las Facturas de Egresos</h2>
            </div>
            <FacturasList data={egressData} type="egress" variant="full" onUpdate={fetchData} />
          </div>
        )}

        {activeTab === "logs" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Logs de Procesamiento</h2>
            <LogsList data={logsData} />
          </div>
        )}
      </main>
    </div>
  )
}
