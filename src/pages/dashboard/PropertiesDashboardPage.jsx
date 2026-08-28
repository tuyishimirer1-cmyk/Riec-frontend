import { Home, Building2, CheckCircle, Clock, TrendingUp, Mail } from 'lucide-react';

const PropertiesDashboardPage = () => {
  const stats = [
    {
      label: 'Total Properties',
      value: '0',
      icon: Home,
      color: 'bg-blue-500',
      change: '+0%',
    },
    {
      label: 'Pending Verification',
      value: '0',
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+0%',
    },
    {
      label: 'Verified Properties',
      value: '0',
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+0%',
    },
    {
      label: 'Featured Properties',
      value: '0',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+0%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Properties Marketplace</h1>
        <p className="text-gray-600">Manage properties, verifications, and inquiries</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Coming Soon Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 bg-riec-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-riec-orange" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Properties Management Coming Soon!
        </h2>
        
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          The complete properties management system is being built. You will be able to:
        </p>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-6 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Verify Properties</h3>
                <p className="text-sm text-gray-600">Review and verify property submissions with documents</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-green-50 p-2 rounded-lg flex-shrink-0">
                <Home className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Manage Listings</h3>
                <p className="text-sm text-gray-600">Edit, feature, or archive property listings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-purple-50 p-2 rounded-lg flex-shrink-0">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Handle Inquiries</h3>
                <p className="text-sm text-gray-600">Manage property inquiries and viewing requests</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-riec-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
                <p className="text-sm text-gray-600">Track property views, inquiries, and conversions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-riec-orange/10 border border-riec-orange/20 rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-gray-700 font-medium mb-2">
            📊 Full properties management system is under development
          </p>
          <p className="text-gray-600 text-sm">
            Database schema is ready. Backend API and frontend pages are being implemented.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          disabled
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-riec-orange transition-colors cursor-not-allowed opacity-50"
        >
          <Home className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Add Property</h3>
          <p className="text-sm text-gray-600">Coming soon</p>
        </button>

        <button
          disabled
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-riec-orange transition-colors cursor-not-allowed opacity-50"
        >
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Pending Reviews</h3>
          <p className="text-sm text-gray-600">Coming soon</p>
        </button>

        <button
          disabled
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-riec-orange transition-colors cursor-not-allowed opacity-50"
        >
          <Mail className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Inquiries</h3>
          <p className="text-sm text-gray-600">Coming soon</p>
        </button>
      </div>
    </div>
  );
};

export default PropertiesDashboardPage;
