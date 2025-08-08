import React from 'react';
import { useState } from 'react';
import { Building2, Users, DollarSign, MapPin, Plus, X } from 'lucide-react';
import { mockProperties } from '../data/mockData';
import { Property } from '../types';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalUnits: '',
    occupiedUnits: '',
    monthlyRevenue: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      totalUnits: '',
      occupiedUnits: '',
      monthlyRevenue: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProperty = () => {
    if (!formData.name || !formData.address || !formData.totalUnits) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const newProperty: Property = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address,
      totalUnits: parseInt(formData.totalUnits),
      occupiedUnits: parseInt(formData.occupiedUnits) || 0,
      monthlyRevenue: parseInt(formData.monthlyRevenue) || 0
    };

    setProperties(prev => [...prev, newProperty]);
    setShowAddProperty(false);
    resetForm();
    alert('Pand succesvol toegevoegd!');
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      address: property.address,
      totalUnits: property.totalUnits.toString(),
      occupiedUnits: property.occupiedUnits.toString(),
      monthlyRevenue: property.monthlyRevenue.toString()
    });
  };

  const handleUpdateProperty = () => {
    if (!editingProperty || !formData.name || !formData.address || !formData.totalUnits) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const updatedProperty: Property = {
      ...editingProperty,
      name: formData.name,
      address: formData.address,
      totalUnits: parseInt(formData.totalUnits),
      occupiedUnits: parseInt(formData.occupiedUnits) || 0,
      monthlyRevenue: parseInt(formData.monthlyRevenue) || 0
    };

    setProperties(prev => prev.map(p => p.id === editingProperty.id ? updatedProperty : p));
    setEditingProperty(null);
    resetForm();
    alert('Pand succesvol bijgewerkt!');
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm('Weet je zeker dat je dit pand wilt verwijderen?')) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      alert('Pand verwijderd');
    }
  };

  const handleViewDetails = (property: Property) => {
    alert(`Pand Details:\n\nNaam: ${property.name}\nAdres: ${property.address}\nEenheden: ${property.occupiedUnits}/${property.totalUnits}\nMaandelijkse Omzet: €${property.monthlyRevenue.toLocaleString()}\nBezettingsgraad: ${((property.occupiedUnits / property.totalUnits) * 100).toFixed(1)}%`);
  };

  const closeModal = () => {
    setShowAddProperty(false);
    setEditingProperty(null);
    resetForm();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panden</h1>
          <p className="text-gray-600">Beheer je huurpanden</p>
        </div>
        <button 
          onClick={() => setShowAddProperty(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Pand Toevoegen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white relative">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10">
                <Building2 className="w-8 h-8 mb-4" />
                <h2 className="text-2xl font-bold mb-2">{property.name}</h2>
                <div className="flex items-center text-blue-100">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{property.address}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{property.occupiedUnits}</p>
                  <p className="text-sm text-gray-600">van {property.totalUnits} eenheden</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">€{property.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">per maand</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Bezettingsgraad</span>
                  <span>{((property.occupiedUnits / property.totalUnits) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(property.occupiedUnits / property.totalUnits) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewDetails(property)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Details
                </button>
                <button 
                  onClick={() => handleEditProperty(property)}
                  className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Bewerken
                </button>
                <button 
                  onClick={() => handleDeleteProperty(property.id)}
                  className="px-4 py-2 border border-red-300 hover:border-red-400 text-red-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Property Modal */}
      {(showAddProperty || editingProperty) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProperty ? 'Pand Bewerken' : 'Nieuw Pand Toevoegen'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pand Naam *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Zonnebloem Appartementen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Hoofdstraat 123, Amsterdam"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Totaal Eenheden *
                </label>
                <input
                  type="number"
                  value={formData.totalUnits}
                  onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                  placeholder="24"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bezette Eenheden
                </label>
                <input
                  type="number"
                  value={formData.occupiedUnits}
                  onChange={(e) => handleInputChange('occupiedUnits', e.target.value)}
                  placeholder="22"
                  min="0"
                  max={formData.totalUnits}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maandelijkse Omzet (€)
                </label>
                <input
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                  placeholder="33000"
                  min="0"
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
                onClick={editingProperty ? handleUpdateProperty : handleAddProperty}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingProperty ? 'Bijwerken' : 'Toevoegen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;