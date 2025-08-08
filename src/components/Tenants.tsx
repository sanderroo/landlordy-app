import React from 'react';
import { useState } from 'react';
import { User, Phone, Mail, Calendar, Home, Plus, Search, Clock, X, Edit, Trash2 } from 'lucide-react';
import { mockTenants, mockProperties } from '../data/mockData';
import { Tenant } from '../types';

const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    unitNumber: '',
    rentAmount: '',
    leaseStart: '',
    leaseEnd: '',
    paymentDay: '1',
    paymentTime: '09:00'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      propertyId: '',
      unitNumber: '',
      rentAmount: '',
      leaseStart: '',
      leaseEnd: '',
      paymentDay: '1',
      paymentTime: '09:00'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = !selectedProperty || tenant.propertyName === selectedProperty;
    return matchesSearch && matchesProperty;
  });

  const handleAddTenant = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.propertyId || !formData.unitNumber || !formData.rentAmount) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const selectedPropertyData = mockProperties.find(p => p.id === formData.propertyId);
    if (!selectedPropertyData) {
      alert('Selecteer een geldig pand');
      return;
    }

    const newTenant: Tenant = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      propertyId: formData.propertyId,
      propertyName: selectedPropertyData.name,
      unitNumber: formData.unitNumber,
      rentAmount: parseInt(formData.rentAmount),
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      paymentDay: parseInt(formData.paymentDay),
      paymentTime: formData.paymentTime
    };

    setTenants(prev => [...prev, newTenant]);
    setShowAddTenant(false);
    resetForm();
    alert('Huurder succesvol toegevoegd!');
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      propertyId: tenant.propertyId,
      unitNumber: tenant.unitNumber,
      rentAmount: tenant.rentAmount.toString(),
      leaseStart: tenant.leaseStart,
      leaseEnd: tenant.leaseEnd,
      paymentDay: tenant.paymentDay.toString(),
      paymentTime: tenant.paymentTime || '09:00'
    });
  };

  const handleUpdateTenant = () => {
    if (!editingTenant || !formData.name || !formData.email || !formData.phone || !formData.propertyId || !formData.unitNumber || !formData.rentAmount) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const selectedPropertyData = mockProperties.find(p => p.id === formData.propertyId);
    if (!selectedPropertyData) {
      alert('Selecteer een geldig pand');
      return;
    }

    const updatedTenant: Tenant = {
      ...editingTenant,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      propertyId: formData.propertyId,
      propertyName: selectedPropertyData.name,
      unitNumber: formData.unitNumber,
      rentAmount: parseInt(formData.rentAmount),
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      paymentDay: parseInt(formData.paymentDay),
      paymentTime: formData.paymentTime
    };

    setTenants(prev => prev.map(t => t.id === editingTenant.id ? updatedTenant : t));
    setEditingTenant(null);
    resetForm();
    alert('Huurder succesvol bijgewerkt!');
  };

  const handleDeleteTenant = (tenantId: string) => {
    if (confirm('Weet je zeker dat je deze huurder wilt verwijderen?')) {
      setTenants(prev => prev.filter(t => t.id !== tenantId));
      alert('Huurder verwijderd');
    }
  };

  const handleViewProfile = (tenant: Tenant) => {
    setViewingTenant(tenant);
  };

  const closeModal = () => {
    setShowAddTenant(false);
    setEditingTenant(null);
    setViewingTenant(null);
    resetForm();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Huurders</h1>
          <p className="text-gray-600">Beheer je huurder informatie</p>
        </div>
        <button 
          onClick={() => setShowAddTenant(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Huurder Toevoegen</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Zoek huurders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Alle Panden</option>
            {mockProperties.map(property => (
              <option key={property.id} value={property.name}>{property.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
                <p className="text-sm text-gray-600">Eenheid {tenant.unitNumber}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                <span>{tenant.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                <span>{tenant.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Home className="w-4 h-4 mr-3 text-gray-400" />
                <span>{tenant.propertyName}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                <span>Huur: {new Date(tenant.leaseStart).toLocaleDateString('nl-NL')} - {new Date(tenant.leaseEnd).toLocaleDateString('nl-NL')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-3 text-gray-400" />
                <span>Betaling: {tenant.paymentDay}e van de maand om {tenant.paymentTime || '09:00'}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Maandelijkse Huur</span>
                <span className="text-lg font-bold text-green-600">€{tenant.rentAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewProfile(tenant)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Profiel
                </button>
                <button 
                  onClick={() => handleEditTenant(tenant)}
                  className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteTenant(tenant.id)}
                  className="px-4 py-2 border border-red-300 hover:border-red-400 text-red-700 rounded-lg font-medium text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Tenant Modal */}
      {(showAddTenant || editingTenant) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTenant ? 'Huurder Bewerken' : 'Nieuwe Huurder Toevoegen'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volledige Naam *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Jan Jansen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="jan@voorbeeld.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefoon *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+31 6 12345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pand *</label>
                <select 
                  value={formData.propertyId}
                  onChange={(e) => handleInputChange('propertyId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecteer Pand</option>
                  {mockProperties.map(property => (
                    <option key={property.id} value={property.id}>{property.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eenheid Nummer *</label>
                <input
                  type="text"
                  value={formData.unitNumber}
                  onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                  placeholder="A101"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maandelijkse Huur (€) *</label>
                <input
                  type="number"
                  value={formData.rentAmount}
                  onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                  placeholder="1500"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Huurcontract Start</label>
                <input
                  type="date"
                  value={formData.leaseStart}
                  onChange={(e) => handleInputChange('leaseStart', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Huurcontract Einde</label>
                <input
                  type="date"
                  value={formData.leaseEnd}
                  onChange={(e) => handleInputChange('leaseEnd', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Betaaldag</label>
                <select 
                  value={formData.paymentDay}
                  onChange={(e) => handleInputChange('paymentDay', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1e van de maand</option>
                  <option value="5">5e van de maand</option>
                  <option value="10">10e van de maand</option>
                  <option value="15">15e van de maand</option>
                  <option value="20">20e van de maand</option>
                  <option value="25">25e van de maand</option>
                  <option value="30">30e van de maand</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Betalingstijd</label>
                <input
                  type="time"
                  value={formData.paymentTime}
                  onChange={(e) => handleInputChange('paymentTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={editingTenant ? handleUpdateTenant : handleAddTenant}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingTenant ? 'Bijwerken' : 'Toevoegen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Tenant Profile Modal */}
      {viewingTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Huurder Profiel</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Persoonlijke Informatie</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Naam:</span> {viewingTenant.name}</div>
                  <div><span className="text-gray-600">E-mail:</span> {viewingTenant.email}</div>
                  <div><span className="text-gray-600">Telefoon:</span> {viewingTenant.phone}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Huur Informatie</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Pand:</span> {viewingTenant.propertyName}</div>
                  <div><span className="text-gray-600">Eenheid:</span> {viewingTenant.unitNumber}</div>
                  <div><span className="text-gray-600">Maandelijkse Huur:</span> €{viewingTenant.rentAmount.toLocaleString()}</div>
                  <div><span className="text-gray-600">Betaaldag:</span> {viewingTenant.paymentDay}e van de maand</div>
                  <div><span className="text-gray-600">Betalingstijd:</span> {viewingTenant.paymentTime || '09:00'}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Huurcontract</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-600">Start:</span> {new Date(viewingTenant.leaseStart).toLocaleDateString('nl-NL')}</div>
                <div><span className="text-gray-600">Einde:</span> {new Date(viewingTenant.leaseEnd).toLocaleDateString('nl-NL')}</div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setViewingTenant(null);
                  handleEditTenant(viewingTenant);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Bewerken
              </button>
              <button
                onClick={() => handleDeleteTenant(viewingTenant.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;