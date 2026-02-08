
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileSettings() {
  const [activeSection, setActiveSection] = useState('profile');
  const user = useAuthStore(state => state.user);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    avatarImage: user.avatarImage
  });

  

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const sections = [
    { id: 'profile', label: 'Profile Info', icon: 'ri-user-line' },
    { id: 'security', label: 'Security', icon: 'ri-shield-line' },
    { id: 'payment', label: 'Payment Methods', icon: 'ri-bank-card-line' },
  ];

  return (
    <>
    {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-28 right-6 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <i className="ri-check-line w-5 h-5 flex items-center justify-center"></i>
          Settings saved successfully!
        </div>
      )}

    <div className="space-y-6">



      {/* Settings Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 pt-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-[#8B2635] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <i className={`${section.icon} w-4 h-4 flex items-center justify-center`}></i>
            {section.label}
          </button>
        ))}
      </div>

      {/* Profile Info Section */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
          
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={formData.avatarImage}
                alt="Profile"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <button className="bg-[#8B2635] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap mr-3">
                Change Photo
              </button>
              <button className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap">
                Remove
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/20 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/20 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/20 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/20 outline-none transition-all text-sm"
              />
            </div>

          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              className="bg-[#8B2635] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}



      {/* Security Section */}
      {activeSection === 'security' && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
          
          <div className="space-y-6">
            {/* Change Password */}
            <div className="pb-6 border-b border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/20 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/20 outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B2635] focus:ring-2 focus:ring-[#8B2635]/20 outline-none transition-all text-sm"
                  />
                </div>
                <button className="bg-[#8B2635] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap">
                  Update Password
                </button>
              </div>
            </div>


          </div>
        </div>
      )}

      {/* Payment Methods Section */}
      {activeSection === 'payment' && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
            <button className="bg-[#8B2635] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#7A1F2B] transition-all cursor-pointer whitespace-nowrap flex items-center gap-2">
              <i className="ri-add-line w-4 h-4 flex items-center justify-center"></i>
              Add New Card
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Card 1 */}
            <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-[#8B2635] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-10 bg-gradient-to-r from-[#1A1F71] to-[#2E77BC] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• 0000</p>
                  <p className="text-sm text-gray-500">Expires 12/26</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Default</span>
                <button className="text-gray-400 hover:text-gray-600 cursor-pointer w-8 h-8 flex items-center justify-center">
                  <i className="ri-more-2-fill"></i>
                </button>
              </div>
            </div>


          </div>

          {/* Billing Address */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Billing Address</h3>
            <div className="p-5 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-900">User 1</p>
              <p className="text-gray-600 mt-1">aaa street</p>
              <p className="text-gray-600">city, province, code</p>
              <p className="text-gray-600">Country</p>
              <button className="text-[#8B2635] text-sm font-medium mt-3 hover:underline cursor-pointer whitespace-nowrap">
                Edit Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
