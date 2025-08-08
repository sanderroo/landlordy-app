import React from 'react';
import { useState } from 'react';
import { 
  Bell, 
  Clock, 
  Calendar, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus
} from 'lucide-react';

const Reminders: React.FC = () => {
  const [showAddRule, setShowAddRule] = useState(false);

  const handleSendAllTikkieLinks = () => {
    alert('Sending Tikkie payment links to all tenants...');
  };

  const handleSendOverdueReminders = () => {
    alert('Sending overdue payment reminders...');
  };

  const handleManageRules = () => {
    alert('Opening automation rules management...');
  };

  const automationRules = [
    {
      id: '1',
      name: 'Monthly Payment Links',
      description: 'Send Tikkie payment links on configured day of month for each tenant',
      trigger: 'Tenant-specific day of month & time',
      action: 'Send WhatsApp Tikkie link',
      status: 'active',
      lastRun: '2024-01-01',
      nextRun: '2024-02-01'
    },
    {
      id: '2', 
      name: 'First Overdue Reminder',
      description: 'Send first reminder 1 day after payment is due',
      trigger: '1 day after due date',
      action: 'Send WhatsApp reminder',
      status: 'active',
      lastRun: '2024-01-02',
      nextRun: '2024-01-05'
    },
    {
      id: '3',
      name: 'Second Overdue Reminder',
      description: 'Send second reminder 5 days after payment is due',
      trigger: '5 days after due date',
      action: 'Send WhatsApp reminder + Email',
      status: 'active',
      lastRun: '2024-01-06',
      nextRun: '2024-01-09'
    },
    {
      id: '4',
      name: 'Final Notice',
      description: 'Send final notice 10 days after payment is due',
      trigger: '10 days after due date',
      action: 'Send formal notice',
      status: 'paused',
      lastRun: '2024-01-11',
      nextRun: '-'
    }
  ];

  const upcomingReminders = [
    {
      id: '1',
      tenantName: 'Sarah Johnson',
      propertyName: 'Sunset Apartments',
      unitNumber: 'B205',
      action: 'Payment Link',
      scheduledFor: '2024-01-28',
      amount: 1600,
      status: 'scheduled',
      type: 'tikkie_link'
    },
    {
      id: '2',
      tenantName: 'Michael Brown',
      propertyName: 'Oak Street Complex',
      unitNumber: 'C304',
      action: 'First Reminder',
      scheduledFor: '2024-01-29',
      amount: 1800,
      status: 'scheduled'
    },
    {
      id: '3',
      tenantName: 'Emily Davis',
      propertyName: 'Oak Street Complex',
      unitNumber: 'A102',
      action: 'Payment Link',
      scheduledFor: '2024-01-30',
      amount: 1700,
      status: 'scheduled'
    }
  ];

  const reminderStats = {
    totalSent: 47,
    deliveryRate: 96,
    responseRate: 73,
    effectiveRate: 89
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Automated Reminders</h1>
          <p className="text-gray-600">Manage automated payment reminders and notifications</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Reminder Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">This month</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{reminderStats.totalSent}</h3>
          <p className="text-gray-600 text-sm">Messages Sent</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{reminderStats.deliveryRate}%</h3>
          <p className="text-gray-600 text-sm">Delivery Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{reminderStats.responseRate}%</h3>
          <p className="text-gray-600 text-sm">Response Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{reminderStats.effectiveRate}%</h3>
          <p className="text-gray-600 text-sm">Payment Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Automation Rules */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Automation Rules</h2>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{rule.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rule.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Trigger:</span>
                    <div className="font-medium text-gray-900">{rule.trigger}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Next Run:</span>
                    <div className="font-medium text-gray-900">{rule.nextRun}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Reminders</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{reminder.tenantName}</h3>
                    <p className="text-sm text-gray-600">{reminder.propertyName} - {reminder.unitNumber}</p>
                  </div>
                  <span className="text-lg font-bold text-green-600">${reminder.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {new Date(reminder.scheduledFor).toLocaleDateString()} 
                      <span className="ml-2 text-xs text-gray-500">
                        ({new Date(reminder.scheduledFor).toLocaleDateString('en-US', { weekday: 'long' })})
                      </span>
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    reminder.action === 'Payment Link'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {reminder.action}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">
            View All Scheduled
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleSendAllTikkieLinks}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Send All Tikkie Links</span>
          </button>
          <button 
            onClick={handleSendOverdueReminders}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span>Send Overdue Reminders</span>
          </button>
          <button 
            onClick={handleManageRules}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Manage Rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reminders;