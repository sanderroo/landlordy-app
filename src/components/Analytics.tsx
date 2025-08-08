import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  BarChart3,
  PieChart
} from 'lucide-react';

const Analytics: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 83800, collected: 78900, occupancy: 91 },
    { month: 'Feb', revenue: 85200, collected: 82100, occupancy: 93 },
    { month: 'Mar', revenue: 86500, collected: 84200, occupancy: 94 },
    { month: 'Apr', revenue: 84200, collected: 81500, occupancy: 89 },
    { month: 'May', revenue: 87800, collected: 85600, occupancy: 96 },
    { month: 'Jun', revenue: 89100, collected: 87300, occupancy: 97 },
  ];

  const paymentMetrics = {
    onTime: 78,
    late: 15,
    missed: 7
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your rental business performance and trends</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">$87,300</h3>
          <p className="text-gray-600 text-sm">Revenue Collected (June)</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+3%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">97%</h3>
          <p className="text-gray-600 text-sm">Occupancy Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+5%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">78%</h3>
          <p className="text-gray-600 text-sm">On-Time Payments</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex items-center text-red-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">-2%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">7%</h3>
          <p className="text-gray-600 text-sm">Missed Payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trends</h2>
          <div className="relative h-80">
            <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
              {monthlyData.map((data, index) => {
                const height = (data.collected / 90000) * 100;
                return (
                  <div key={data.month} className="flex flex-col items-center">
                    <div className="mb-2 text-xs text-gray-600 font-medium">
                      ${(data.collected / 1000).toFixed(0)}k
                    </div>
                    <div
                      className="w-12 bg-blue-600 rounded-t-lg transition-all duration-500 hover:bg-blue-700"
                      style={{ height: `${height}%` }}
                    />
                    <div className="mt-2 text-sm text-gray-600">{data.month}</div>
                  </div>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-100 rounded-b-lg" />
          </div>
        </div>

        {/* Payment Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Distribution</h2>
          <div className="flex items-center justify-center h-80">
            <div className="relative w-48 h-48">
              {/* Simple pie chart representation */}
              <div className="w-full h-full rounded-full bg-gradient-conic from-green-500 via-yellow-500 to-red-500 relative">
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">{paymentMetrics.onTime}%</div>
              <div className="text-sm text-gray-600">On Time</div>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">{paymentMetrics.late}%</div>
              <div className="text-sm text-gray-600">Late</div>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-2" />
              <div className="text-lg font-semibold text-gray-900">{paymentMetrics.missed}%</div>
              <div className="text-sm text-gray-600">Missed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Property</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Collection Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Occupancy</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">Sunset Apartments</div>
                    <div className="text-sm text-gray-600">24 units</div>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900">$33,000</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    94%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    92%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+8%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">Oak Street Complex</div>
                    <div className="text-sm text-gray-600">18 units</div>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900">$28,800</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    87%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    89%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+3%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">Downtown Lofts</div>
                    <div className="text-sm text-gray-600">12 units</div>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-gray-900">$22,000</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    96%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    92%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+12%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;