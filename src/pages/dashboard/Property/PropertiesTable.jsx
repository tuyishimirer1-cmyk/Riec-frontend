import { useState } from 'react';
import { 
  Eye, Edit2, Trash2, CheckCircle, XCircle, Star, StarOff, 
  Home, Building2, MapPin, DollarSign, Calendar, Phone, Mail 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  useGetAllPropertiesAdmin, 
  useVerifyProperty, 
  useRejectProperty, 
  useDeleteProperty,
  useToggleFeatured 
} from '../../../react-query/propertiesQuery';

const PropertiesTable = () => {
  const [page, setPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading } = useGetAllPropertiesAdmin({ page, limit: 20 });
  const verifyProperty = useVerifyProperty();
  const rejectProperty = useRejectProperty();
  const deleteProperty = useDeleteProperty();
  const toggleFeatured = useToggleFeatured();

  const handleVerify = async (id) => {
    if (window.confirm('Are you sure you want to verify this property?')) {
      try {
        await verifyProperty.mutateAsync(id);
        toast.success('Property verified successfully');
      } catch (error) {
        toast.error('Failed to verify property');
      }
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      await rejectProperty.mutateAsync({ 
        id: selectedProperty.id, 
        reason: rejectReason 
      });
      toast.success('Property rejected');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedProperty(null);
    } catch (error) {
      toast.error('Failed to reject property');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await deleteProperty.mutateAsync(id);
        toast.success('Property deleted successfully');
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await toggleFeatured.mutateAsync({ id });
      toast.success('Featured status updated');
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const getStatusBadge = (status, verificationStatus) => {
    if (status === 'REJECTED') {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">Rejected</span>;
    }
    
    if (verificationStatus === 'VERIFIED') {
      return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
        <CheckCircle className="w-3 h-3" /> Verified
      </span>;
    }
    
    if (verificationStatus === 'PENDING') {
      return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">Pending</span>;
    }
    
    return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Draft</span>;
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency || 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyIcon = (type) => {
    switch (type) {
      case 'HOUSE': return '🏠';
      case 'APARTMENT': return '🏢';
      case 'LAND': return '🌳';
      case 'COMMERCIAL': return '🏭';
      case 'VILLA': return '🏰';
      default: return '📍';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-riec-orange"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.items?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Home className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 mb-1">No properties yet</p>
                    <p className="text-sm text-gray-500">Add your first property to get started</p>
                  </td>
                </tr>
              ) : (
                data?.items?.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {property.images?.[0]?.url ? (
                          <img
                            src={property.images[0].url}
                            alt={property.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Home className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{property.title}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            {property.isFeatured && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                            {property.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getPropertyIcon(property.propertyType)}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{property.propertyType}</p>
                          <p className="text-xs text-gray-500">{property.listingType === 'FOR_SALE' ? 'For Sale' : 'For Rent'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(property.price, property.currency)}
                      </p>
                      {property.priceNegotiable && (
                        <p className="text-xs text-green-600">Negotiable</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900">{property.sector}</p>
                          <p className="text-xs text-gray-500">{property.district}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(property.status, property.verificationStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(property.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {property.verificationStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => handleVerify(property.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Verify Property"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {property.status !== 'REJECTED' && (
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowRejectModal(true);
                            }}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Reject Property"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleFeatured(property.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            property.isFeatured
                              ? 'text-yellow-600 hover:bg-yellow-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={property.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                        >
                          {property.isFeatured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing page {data.page} of {data.totalPages} ({data.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Details Modal */}
      {showDetailsModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Images */}
              {selectedProperty.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedProperty.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Basic Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h3>
                <p className="text-gray-600">{selectedProperty.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-riec-orange" />
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">{formatPrice(selectedProperty.price, selectedProperty.currency)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-riec-orange" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{selectedProperty.sector}, {selectedProperty.district}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-riec-orange" />
                  <div>
                    <p className="text-sm text-gray-500">Land Size</p>
                    <p className="font-semibold">{selectedProperty.landSize} m²</p>
                  </div>
                </div>

                {selectedProperty.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-riec-orange" />
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms / Bathrooms</p>
                      <p className="font-semibold">{selectedProperty.bedrooms} / {selectedProperty.bathrooms || 0}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {selectedProperty.amenities?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Contact */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Seller Contact</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedProperty.sellerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedProperty.sellerEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Property</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting "{selectedProperty.title}"
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Incomplete information, invalid documents..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-riec-orange focus:border-transparent mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedProperty(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject Property
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesTable;
