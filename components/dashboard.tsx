"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/header"
import { FacturasList } from "@/components/facturas-list"
import { StatsCard } from "@/components/stats-card"
import { mockIncomeData, mockEgressData } from "@/lib/mock-data"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { logout } = useAuth()

  const totalIncome = mockIncomeData.reduce((sum, item) => sum + Number.parseFloat(item.totalAmount), 0)
  const totalEgress = mockEgressData.reduce((sum, item) => sum + Number.parseFloat(item.totalAmount), 0)

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
                  value={mockIncomeData.length + mockEgressData.length}
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
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingresos ({mockIncomeData.length})</h3>
                  <FacturasList data={mockIncomeData.slice(0, 5)} type="income" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Egresos ({mockEgressData.length})</h3>
                  <FacturasList data={mockEgressData.slice(0, 5)} type="egress" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ingresos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Todas las Facturas de Ingresos</h2>
            <FacturasList data={mockIncomeData} type="income" />
          </div>
        )}

        {activeTab === "egresos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Todas las Facturas de Egresos</h2>
            <FacturasList data={mockEgressData} type="egress" />
          </div>
        )}
      </main>
    </div>
  )
}
