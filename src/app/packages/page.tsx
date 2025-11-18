export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Packages & Purchase</h1>
      <p className="text-gray-600">Placeholder for package browsing and purchase flow. Implement package list, details, and checkout integration here.</p>
    </main>
  );
}
/**
 * Packages Browse Page
 * Allows guardians to browse and purchase care packages
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { BkashPayment } from '@/components/ui/BkashPayment';
import { NagadPayment } from '@/components/ui/NagadPayment';
import { useApi } from '@/hooks/useApi';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
  companyId: string;
  companyName: string;
  companyLogo?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Company {
  id: string;
  name: string;
  logo?: string;
  isVerified: boolean;
  rating: number;
}

export default function PackagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const { request } = useApi();
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');

  useEffect(() => {
    fetchPackages();
    fetchCompanies();
  }, [currentPage, searchTerm, selectedCompany, priceRange, sortBy]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCompany && { companyId: selectedCompany }),
        ...(priceRange.min && { minPrice: priceRange.min }),
        ...(priceRange.max && { maxPrice: priceRange.max }),
      });
      
      const response = await request(`/packages?${params}`);
      setPackages(response.data.packages || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await request('/companies?verified=true');
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handlePurchasePackage = async (pkg: Package) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      // Create payment record
      const paymentResponse = await request('/payments/create', {
        method: 'POST',
        body: {
          packageId: selectedPackage?.id,
          amount: selectedPackage?.price,
          currency: selectedPackage?.currency,
          gateway: selectedPaymentMethod,
          gatewayTransactionId: paymentData.transactionId,
          status: 'COMPLETED',
        },
      });

      if (paymentResponse.success) {
        // Create job from package
        const jobResponse = await request('/jobs', {
          method: 'POST',
          body: {
            packageId: selectedPackage?.id,
            paymentId: paymentResponse.data.id,
            guardianId: session.user.id,
            status: 'PENDING',
          },
        });

        if (jobResponse.success) {
          setShowPaymentModal(false);
          setSelectedPackage(null);
          router.push(`/jobs/${jobResponse.data.id}`);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency === 'BDT' ? 'BDT' : 'USD',
    }).format(price);
  };

  const getDurationText = (duration: number) => {
    if (duration < 30) {
      return t('package.duration.days', { count: duration });
    } else if (duration < 365) {
      const months = Math.floor(duration / 30);
      return t('package.duration.months', { count: months });
    } else {
      const years = Math.floor(duration / 365);
      return t('package.duration.years', { count: years });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('package.browsePackages')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('package.browsePackagesDescription')}
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <Card.Header>
          <Card.Title>{t('package.filterPackages')}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('package.search')}
              </label>
              <Input
                type="text"
                placeholder={t('package.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('package.company')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">{t('package.allCompanies')}</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} {company.isVerified && '✓'}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('package.priceRange')}
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder={t('package.minPrice')}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder={t('package.maxPrice')}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('package.sortBy')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">{t('package.sort.newest')}</option>
                <option value="price">{t('package.sort.lowestPrice')}</option>
                <option value="-price">{t('package.sort.highestPrice')}</option>
                <option value="rating">{t('package.sort.highestRated')}</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Packages Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
              <Card.Content className="p-6">
                {/* Company Info */}
                <div className="flex items-center mb-4">
                  {pkg.companyLogo && (
                    <img
                      src={pkg.companyLogo}
                      alt={pkg.companyName}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {pkg.companyName}
                    </h3>
                    {pkg.isVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {t('package.verified')}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">
                        {pkg.rating.toFixed(1)} ({pkg.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {pkg.name}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {pkg.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    {t('package.features')}:
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-gray-500">
                        +{pkg.features.length - 3} {t('package.moreFeatures')}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Price and Duration */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(pkg.price, pkg.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getDurationText(pkg.duration)}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  onClick={() => handlePurchasePackage(pkg)}
                  disabled={!pkg.isActive}
                >
                  {pkg.isActive ? t('package.purchase') : t('package.notAvailable')}
                </Button>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('package.noPackagesFound')}
          </h3>
          <p className="text-gray-500">
            {t('package.tryDifferentFilters')}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {t('common.previous')}
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('package.purchasePackage')}
            </h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                {selectedPackage.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {selectedPackage.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{t('package.price')}:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(selectedPackage.price, selectedPackage.currency)}
                </span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('package.selectPaymentMethod')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 border-2 rounded-lg ${
                    selectedPaymentMethod === 'bkash'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod('bkash')}
                >
                  <div className="text-center">
                    <div className="text-pink-600 font-bold">bKash</div>
                    <div className="text-xs text-gray-600">
                      {t('payment.bkash')}
                    </div>
                  </div>
                </button>
                
                <button
                  className={`p-4 border-2 rounded-lg ${
                    selectedPaymentMethod === 'nagad'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod('nagad')}
                >
                  <div className="text-center">
                    <div className="text-orange-600 font-bold">Nagad</div>
                    <div className="text-xs text-gray-600">
                      {t('payment.nagad')}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Component */}
            <div className="mb-6">
              {selectedPaymentMethod === 'bkash' ? (
                <BkashPayment
                  amount={selectedPackage.price}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPaymentModal(false)}
                />
              ) : (
                <NagadPayment
                  amount={selectedPackage.price}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setShowPaymentModal(false)}
                />
              )}
            </div>

            {/* Cancel Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPaymentModal(false)}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}