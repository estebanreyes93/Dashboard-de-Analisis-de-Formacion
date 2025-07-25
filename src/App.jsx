import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Users, Target, BookOpen, Award, TrendingUp, Building } from 'lucide-react';
import MetricCard from './components/MetricCard';
import ChartCard from './components/ChartCard';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import {
  resumenGeneral,
  capacitadosPorDepartamento,
  cumplimientoMeta,
  capacitadosPorTipo,
  capacitadosPorColectivo,
  capacitadosPorPilar,
  chartColors
} from './data/formacionData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState("overview");

  // Colores para gráficos de pie
  const pieColors = [
    chartColors.primary, chartColors.secondary, chartColors.accent, 
    chartColors.warning, chartColors.info, chartColors.success,
    chartColors.purple, chartColors.pink, chartColors.indigo, chartColors.danger
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-DO').format(num);
  };

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard de Análisis de Formación
          </h1>
          <p className="text-lg text-gray-600">
            Poder Judicial - Resultados del Ciclo de Capacitación
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Capacitados"
            value={formatNumber(resumenGeneral.totalCapacitados)}
            subtitle="Participantes que aprobaron"
            icon={Users}
            color="text-blue-600"
          />
          <MetricCard
            title="Tasa de Deserción"
            value={formatPercentage(resumenGeneral.porcentajeDesercion)}
            subtitle="Excelente retención"
            icon={Target}
            color="text-green-600"
          />
          <MetricCard
            title="Departamentos"
            value={capacitadosPorDepartamento.length}
            subtitle="Cobertura nacional"
            icon={Building}
            color="text-purple-600"
          />
          <MetricCard
            title="Tipos de Formación"
            value={capacitadosPorTipo.length}
            subtitle="Modalidades diversas"
            icon={BookOpen}
            color="text-orange-600"
          />
        </div>

        {/* Tabs para diferentes vistas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
            <TabsTrigger value="types">Tipos</TabsTrigger>
            <TabsTrigger value="groups">Colectivos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Capacitados por Pilar de Justicia">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={capacitadosPorPilar}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ pilar, capacitados }) => `${pilar}: ${capacitados}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="capacitados"
                    >
                      {capacitadosPorPilar.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), 'Capacitados']} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Top 5 Departamentos">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={capacitadosPorDepartamento.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="departamento" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatNumber(value), 'Capacitados']} />
                    <Bar dataKey="capacitados" fill={chartColors.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Capacitados por Departamento Judicial">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={capacitadosPorDepartamento} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="departamento" 
                      type="category" 
                      width={150}
                      fontSize={10}
                    />
                    <Tooltip formatter={(value) => [formatNumber(value), 'Capacitados']} />
                    <Bar dataKey="capacitados" fill={chartColors.secondary} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Cumplimiento de Metas por Departamento">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={cumplimientoMeta}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="departamento" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'cumplimiento') return [formatPercentage(value), '% Cumplimiento'];
                        return [formatNumber(value), name === 'capacitados' ? 'Capacitados' : 'Meta'];
                      }}
                    />
                    <Bar dataKey="capacitados" fill={chartColors.primary} name="capacitados" />
                    <Bar dataKey="meta" fill={chartColors.accent} name="meta" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Capacitados por Tipo de Formación">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={capacitadosPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, capacitados }) => `${tipo}: ${capacitados}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="capacitados"
                    >
                      {capacitadosPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), 'Capacitados']} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Distribución por Tipo (Barras)">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={capacitadosPorTipo}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="tipo" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={11}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatNumber(value), 'Capacitados']} />
                    <Bar dataKey="capacitados" fill={chartColors.info} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <ChartCard title="Capacitados por Colectivo" className="w-full">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={capacitadosPorColectivo} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="colectivo" 
                    type="category" 
                    width={200}
                    fontSize={11}
                  />
                  <Tooltip formatter={(value) => [formatNumber(value), 'Capacitados']} />
                  <Bar dataKey="capacitados" fill={chartColors.purple} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Dashboard generado automáticamente - Poder Judicial República Dominicana</p>
          <p className="mt-1">Datos procesados del ciclo de formación completado</p>
        </div>
      </div>
    </div>
  );
}

export default App;

