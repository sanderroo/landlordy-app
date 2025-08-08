import React, { useState } from 'react';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  MessageSquare,
  Filter,
  Calendar,
  ExternalLink,
  Eye,
  Edit,
  Download
} from 'lucide-react';
import { mockPayments } from '../data/mockData';
import { tikkieService } from '../services/tikkieService';

const Payments: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [showPaymentDetails, setShowPaymentDetails] = useState<string | null>(null);

  const filteredPayments = mockPayments.filter(payment => {
    const matchesStatus = !selectedStatus || payment.status === selectedStatus;
    const matchesProperty = !selectedProperty || payment.propertyName === selectedProperty;
    return matchesStatus && matchesProperty;
  });

  const handleSendReminder = async (paymentId: string) => {
    const payment = mockPayments.find(p => p.id === paymentId);
    if (payment) {
      try {
        await tikkieService.sendPaymentLinkViaWhatsApp(
          '+31612345678',
          'https://tikkie.me/pay/example',
          payment.amount * 100,
          payment.tenantName
        );
        alert(`Herinnering verstuurd via WhatsApp naar ${payment.tenantName}`);
      } catch (error) {
        alert('Versturen herinnering mislukt');
      }
    }
  };

  const handleSendPaymentLink = async (paymentId: string) => {
    const payment = mockPayments.find(p => p.id === paymentId);
    if (payment) {
      try {
        const tikkieRequest = await tikkieService.createPaymentRequest({
          amountInCents: payment.amount * 100,
          currency: 'EUR',
          description: `Maandelijkse huur - ${payment.propertyName} ${payment.unitNumber}`,
          externalId: `huur_${payment.id}`,
          referenceId: payment.tenantId
        });

        await tikkieService.sendPaymentLinkViaWhatsApp(
          '+31612345678',
          tikkieRequest.url,
          payment.amount * 100,
          payment.tenantName
        );

        alert(`Tikkie betaallink verstuurd naar ${payment.tenantName}!\nLink: ${tikkieRequest.url}`);
      } catch (error) {
        alert('Aanmaken en versturen Tikkie betaallink mislukt');
      }
    }
  };

  const handleViewDetails = (paymentId: string) => {
    setShowPaymentDetails(paymentId);
  };

  const handleEditPayment = (paymentId: string) => {
    alert(`Bewerken betaling ${paymentId}`);
  };

  const handleExportPayments = () => {
    alert('Betalingen exporteren naar Excel...');
  };

  const handleSendAllLinks = () => {
    if (confirm('Weet je zeker dat je alle Tikkie links wilt versturen?')) {
      alert('Alle Tikkie links worden verstuurd...');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Betaald';
      case 'pending':
        return 'In behandeling';
      case 'overdue':
        return 'Achterstallig';
      default:
        return status;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Betalingen</h1>
          <p className="text-gray-600">Volg huurbetalingen en verstuur herinneringen</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportPayments}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Exporteren</span>
          </button>
          <button 
            onClick={handleSendAllLinks}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Send className="w-5 h-5" />
            <span>Alle Links Versturen</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totaal Ontvangen</p>
              <p className="text-2xl font-bold text-green-600">
                €{mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Behandeling</p>
              <p className="text-2xl font-bold text-yellow-600">
                {mockPayments.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Achterstallig</p>
              <p className="text-2xl font-bold text-red-600">
                {mockPayments.filter(p => p.status === 'overdue').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inningspercentage</p>
              <p className="text-2xl font-bold text-blue-600">
                {((mockPayments.filter(p => p.status === 'paid').length / mockPayments.length) * 100).toFixed(0)}%
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Alle Statussen</option>
            <option value="paid">Betaald</option>
            <option value="pending">In Behandeling</option>
            <option value="overdue">Achterstallig</option>
          </select>
          <select 
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Alle Panden</option>
            <option value="Zonnebloem Appartementen">Zonnebloem Appartementen</option>
            <option value="Eikenlaan Complex">Eikenlaan Complex</option>
            <option value="Centrum Lofts">Centrum Lofts</option>
          </select>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Betalingsoverzicht</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Huurder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrag</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vervaldatum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Herinneringen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">
                          {payment.tenantName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.tenantName}</div>
                        <div className="text-sm text-gray-500">Eenheid {payment.unitNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.propertyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.dueDate).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.remindersSent > 0 ? (
                      <span className="text-orange-600">{payment.remindersSent} verstuurd</span>
                    ) : (
                      <span className="text-gray-400">Geen</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetails(payment.id)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                      title="Bekijk Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditPayment(payment.id)}
                      className="text-gray-600 hover:text-gray-900 inline-flex items-center space-x-1"
                      title="Bewerken"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {payment.status !== 'paid' && (
                      <>
                        <button
                          onClick={() => handleSendPaymentLink(payment.id)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                          title="Verstuur Tikkie Betaallink"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendReminder(payment.id)}
                          className="text-orange-600 hover:text-orange-900 inline-flex items-center space-x-1"
                          title="Verstuur Herinnering"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {(() => {
              const payment = mockPayments.find(p => p.id === showPaymentDetails);
              if (!payment) return null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Betalingsdetails</h3>
                    <button 
                      onClick={() => setShowPaymentDetails(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Huurder Informatie</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">Naam:</span> {payment.tenantName}</div>
                        <div><span className="text-gray-600">Pand:</span> {payment.propertyName}</div>
                        <div><span className="text-gray-600">Eenheid:</span> {payment.unitNumber}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Betaling Informatie</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">Bedrag:</span> €{payment.amount.toLocaleString()}</div>
                        <div><span className="text-gray-600">Vervaldatum:</span> {new Date(payment.dueDate).toLocaleDateString('nl-NL')}</div>
                        <div><span className="text-gray-600">Status:</span> {getStatusText(payment.status)}</div>
                        {payment.paidDate && (
                          <div><span className="text-gray-600">Betaald op:</span> {new Date(payment.paidDate).toLocaleDateString('nl-NL')}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Acties</h4>
                    <div className="flex space-x-3">
                      {payment.status !== 'paid' && (
                        <>
                          <button
                            onClick={() => handleSendPaymentLink(payment.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Verstuur Tikkie Link
                          </button>
                          <button
                            onClick={() => handleSendReminder(payment.id)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Verstuur Herinnering
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEditPayment(payment.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Bewerken
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;