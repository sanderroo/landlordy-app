import React, { useState } from 'react';
import { MessageSquare, Send, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { mockTenants } from '../data/mockData';
import { tikkieService } from '../services/tikkieService';

const Messages: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [messageText, setMessageText] = useState('');

  const messageTemplates = [
    {
      id: 'payment_reminder',
      title: 'Payment Reminder',
      message: 'Hi {name}, this is a friendly reminder that your rent payment of €{amount} is due on the {paymentDay}{paymentDay === 1 ? "st" : paymentDay === 2 ? "nd" : paymentDay === 3 ? "rd" : "th"} of the month. Please use this Tikkie link to pay: {tikkieLink}.'
    },
    {
      id: 'payment_overdue',
      title: 'Overdue Payment',
      message: 'Hi {name}, your rent payment of €{amount} was due on {dueDate} and is now overdue. Please pay as soon as possible to avoid late fees: {tikkieLink}'
    },
    {
      id: 'tikkie_payment_link',
      title: 'Tikkie Payment Link',
      message: 'Hi {name}, your monthly rent of €{amount} is due on {dueDate}. Pay easily with Tikkie: {tikkieLink}. Thank you!'
    },
    {
      id: 'maintenance_update',
      title: 'Maintenance Update',
      message: 'Hi {name}, we wanted to update you on the maintenance request for your unit. Our team will be arriving on {date} between {time}.'
    }
  ];

  const recentMessages = [
    {
      id: '1',
      tenantName: 'John Smith',
      message: 'Tikkie payment link sent for January rent',
      timestamp: '2024-01-05 10:30 AM',
      status: 'delivered',
      type: 'tikkie_link'
    },
    {
      id: '2',
      tenantName: 'Sarah Johnson',
      message: 'Reminder sent for overdue payment',
      timestamp: '2024-01-03 2:15 PM',
      status: 'read',
      type: 'reminder'
    },
    {
      id: '3',
      tenantName: 'Michael Brown',
      message: 'Maintenance update sent',
      timestamp: '2024-01-02 9:00 AM',
      status: 'delivered',
      type: 'maintenance'
    }
  ];

  const handleSendMessage = async () => {
    if (!selectedTenant || !messageText) return;
    
    const tenant = mockTenants.find(t => t.id === selectedTenant);
    if (tenant) {
      try {
        // If message contains Tikkie link placeholder, create actual Tikkie link
        let finalMessage = messageText;
        if (messageText.includes('{tikkieLink}')) {
          const tikkieRequest = await tikkieService.createPaymentRequest({
            amountInCents: tenant.rentAmount * 100,
            currency: 'EUR',
            description: `Monthly rent - ${tenant.propertyName} ${tenant.unitNumber}`,
            externalId: `rent_${tenant.id}_${Date.now()}`,
            referenceId: tenant.id
          });
          
          finalMessage = messageText
            .replace('{name}', tenant.name)
            .replace('{amount}', tenant.rentAmount.toString())
            .replace('{dueDate}', new Date().toLocaleDateString())
            .replace('{tikkieLink}', tikkieRequest.url);
        }

        // Send via WhatsApp
        await tikkieService.sendPaymentLinkViaWhatsApp(
          tenant.phone,
          finalMessage.includes('tikkie.me') ? finalMessage.match(/https:\/\/tikkie\.me\/[^\s]+/)?.[0] || '' : '',
          tenant.rentAmount * 100,
          tenant.name
        );
        
        alert(`Message sent to ${tenant.name}!`);
        setMessageText('');
        setSelectedTenant('');
      } catch (error) {
        alert('Failed to send message with Tikkie link');
      }
    }
  };

  const handleUseTemplate = (template: any) => {
    setMessageText(template.message);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Send WhatsApp messages and payment reminders to tenants</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Message Composer */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Message</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Tenant</label>
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a tenant...</option>
                  {mockTenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name} - {tenant.propertyName} ({tenant.unitNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={6}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {messageText.length}/1000 characters
                </p>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!selectedTenant || !messageText}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Message Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Message Templates</h2>
            <div className="space-y-3">
              {messageTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{template.title}</h3>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Use Template
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{template.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Messages</h2>
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{message.tenantName}</h3>
                    <div className="flex items-center">
                      {message.status === 'delivered' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : message.status === 'read' ? (
                        <div className="flex">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          <CheckCircle2 className="w-4 h-4 text-blue-600 -ml-1" />
                        </div>
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      message.type === 'tikkie_link' 
                        ? 'bg-blue-100 text-blue-800'
                        : message.type === 'reminder'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {message.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">
              View All Messages
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                <Send className="w-4 h-4" />
                <span>Send All Tikkie Links</span>
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>Send Overdue Reminders</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;