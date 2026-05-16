'use client'

import { motion } from 'framer-motion'
import { TrendingUp, BarChart2, PieChart, Activity, Zap, Users, ImageIcon, FileText } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

const stats = [
  { label: 'Total Projects', value: '6', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', change: '+2 this month' },
  { label: 'Creatives Generated', value: '100', icon: ImageIcon, color: 'text-teal-500', bg: 'bg-teal-50', change: '+24 this week' },
  { label: 'Total Spend', value: '₹1,503.40', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', change: '+₹200 today' },
  { label: 'Team Members', value: '4', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', change: 'Active users' },
]

const barData = [
  { label: 'Mon', social: 12, images: 4, banners: 2 },
  { label: 'Tue', social: 8, images: 7, banners: 3 },
  { label: 'Wed', social: 15, images: 5, banners: 5 },
  { label: 'Thu', social: 6, images: 9, banners: 1 },
  { label: 'Fri', social: 18, images: 12, banners: 6 },
  { label: 'Sat', social: 10, images: 8, banners: 4 },
  { label: 'Sun', social: 5, images: 3, banners: 2 },
]

const maxVal = Math.max(...barData.map((d) => d.social + d.images + d.banners))

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="px-6 py-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
              Analytics
            </h1>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Preview
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Track your creative output and campaign performance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                {stat.value}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
              <p className="text-xs text-green-500 mt-1">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-gray-800">Weekly Output</h2>
                <p className="text-xs text-gray-500">Creatives generated per day</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" />Social</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-teal-500 rounded-full" />Images</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full" />Banners</span>
              </div>
            </div>
            <div className="flex items-end gap-2 h-40">
              {barData.map((day) => {
                const total = day.social + day.images + day.banners
                const h = (total / maxVal) * 100
                return (
                  <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg overflow-hidden flex flex-col-reverse"
                      style={{ height: `${h}%` }}
                    >
                      <div className="bg-blue-500" style={{ height: `${(day.social / total) * 100}%` }} />
                      <div className="bg-teal-400" style={{ height: `${(day.images / total) * 100}%` }} />
                      <div className="bg-amber-400" style={{ height: `${(day.banners / total) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{day.label}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Top Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
          >
            <h2 className="text-sm font-bold text-gray-800 mb-4">Top Campaign Types</h2>
            <div className="space-y-3">
              {[
                { label: 'Festival Offer', pct: 35, color: 'bg-amber-400' },
                { label: 'Product Launch', pct: 28, color: 'bg-blue-500' },
                { label: 'Brand Awareness', pct: 20, color: 'bg-teal-500' },
                { label: 'Seasonal Sale', pct: 17, color: 'bg-purple-400' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-400">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
