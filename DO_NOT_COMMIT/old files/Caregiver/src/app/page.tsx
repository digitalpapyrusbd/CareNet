import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Caregiver Platform</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Professional Caregiver Services
            <span className="block text-blue-600">for Families in Bangladesh</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with verified caregivers, manage patient care, and ensure quality healthcare services for your loved ones.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/about"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Simple steps to get quality care for your loved ones
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="flex justify-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <span className="text-xl font-bold">1</span>
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">Register</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Create your account as a guardian or company and complete verification
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="flex justify-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <span className="text-xl font-bold">2</span>
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">Find Caregivers</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Browse verified caregivers and select the best match for your needs
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="flex justify-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <span className="text-xl font-bold">3</span>
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">Manage Care</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">
                    Schedule appointments, track care logs, and handle payments securely
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Join Our Platform</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Choose your role and start your journey with us
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/auth/register?role=guardian"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Guardian</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Find caregivers for your loved ones
                </p>
              </div>
            </Link>

            <Link
              href="/auth/register?role=company"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Company</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage caregiver services
                </p>
              </div>
            </Link>

            <Link
              href="/auth/register?role=caregiver"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👩‍⚕️</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Caregiver</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Provide professional care services
                </p>
              </div>
            </Link>

            <Link
              href="/auth/register?role=moderator"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Moderator</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Verify and monitor platform quality
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-500">
              © 2025 Caregiver Platform Bangladesh. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}