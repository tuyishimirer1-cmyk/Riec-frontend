import { useState } from 'react';
import { Home, Building2, CheckCircle, Clock, TrendingUp, Plus } from 'lucide-react';
import AddPropertyModal from '../../components/modals/AddPropertyModal';
import PropertiesTable from './Property/PropertiesTable';
import { useGetPropertiesStats } from '../../react-query/propertiesQuery';

const PropertiesDashboardPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { data: stats, isLoading } = useGetPropertiesStats();

  const statsData = [
    {
      label: 'Total Properties',
      value: stats?.total || 0,
      icon: Home,
      color: 'bg-blue-500',
      change: '+0%',
    },
    {
      label: 'Pending Verification',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+0%',
    },
    {
      label: 'Verified Properties',
      value: stats?.verified || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+0%',
    },
    {
      label: 'Featured Properties',
      value: stats?.featured || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+0%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Properties Marketplace</h1>
          <p className="text-gray-600">Manage properties, verifications, and inquiries</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-riec-orange text-white rounded-xl hover:bg-riec-orange-light transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {isLoading ? '...' : stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Properties Table */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Properties</h2>
          <p className="text-sm text-gray-600">Manage, verify, and feature properties</p>
        </div>
        <PropertiesTable />
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default PropertiesDashboardPage;
