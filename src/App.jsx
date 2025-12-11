import React, { useState, useEffect, useCallback } from 'react';
import { AVAILABLE_ORDERS } from './constants';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

// Component Imports
import AuthView from './components/auth/AuthView';
import DriverRegisterView from './components/auth/DriverRegisterView';
import ProfileView from './components/profile/ProfileView';
import AddressSelectionView from './components/client/AddressSelectionView';
import ClientHomeView from './components/client/ClientHomeView';
import ClientSearchView from './components/client/ClientSearchView';
import ClientOrdersView from './components/client/ClientOrdersView';
import RestaurantDetailView from './components/client/RestaurantDetailView';
import LocationPickerView from './components/client/LocationPickerView';
import ClientBottomNav from './components/client/ClientBottomNav';
import DriverDashboard from './components/driver/DriverDashboard';
import DriverActiveOrder from './components/driver/DriverActiveOrder';
import IncomingOrderModal from './components/driver/IncomingOrderModal';

import DriverBottomNav from './components/driver/DriverBottomNav';
import DriverOrderHistoryView from './components/driver/DriverOrderHistoryView';
import ClientCartView from './components/client/ClientCartView';
import ClientCheckoutView from './components/client/ClientCheckoutView';
import ClientPromotionsView from './components/client/ClientPromotionsView';
import EmptyCartModal from './components/client/EmptyCartModal';

import SplashScreen from './components/common/SplashScreen';

const AppContent = () => {
  const { currentUser, isAuthenticated, login, register, logout, updateUserProfile, isLoading } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartCount } = useCart();

  // --- STATE MANAGEMENT ---
  const [showSplash, setShowSplash] = useState(true);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | 'driver-register'
  const [userMode, setUserMode] = useState('driver'); // 'client' | 'driver'
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'search', 'orders', 'profile'
  const [driverTab, setDriverTab] = useState('dashboard');
  const [isDriverOnline, setIsDriverOnline] = useState(false); // 'dashboard', 'available', 'active', 'profile'
  const [view, setView] = useState('main'); // 'main', 'restaurant', 'cart', 'order-tracking'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [address, setAddress] = useState("Av. Abancay 123");
  const [orders, setOrders] = useState([]); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmptyCart, setShowEmptyCart] = useState(false);
  const [authError, setAuthError] = useState(''); // New state for auth errors
  
  const [returnToCheckout, setReturnToCheckout] = useState(false);
  
  // Auth State (Form Data)
  const [loginData, setLoginData] = useState({ user: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', phone: '', email: '', user: '', password: '' });

  // Driver State
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [deliveryStep, setDeliveryStep] = useState(0); // 0: Pickup, 1: Delivering, 2: Delivered
  const [driverMotivation, setDriverMotivation] = useState('');

  // AI State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  // Navbar Visibility State
  const [isProfileSectionActive, setIsProfileSectionActive] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Load data from LocalStorage
    const storedOrders = JSON.parse(localStorage.getItem('chaskys_orders') || '[]');
    setOrders(storedOrders);
  }, []);

  // --- HANDLERS ---

  const onLoginSubmit = useCallback(async (e) => {
      e.preventDefault();
      setAuthError('');
      
      if (!loginData.user || !loginData.password) {
          setAuthError('Por favor completa todos los campos');
          return;
      }

      setIsProcessing(true);
      try {
          await login(loginData.user, loginData.password);
          setUserMode('client'); // Default to client on login, unless they are a driver (mock logic)
          setView('main');
      } catch (error) {
          setAuthError(error);
      } finally {
          setIsProcessing(false);
      }
  }, [loginData, login]);

  const onRegisterSubmit = useCallback(async (e) => {
      e.preventDefault();
      setAuthError('');

      if (!registerData.name || !registerData.user || !registerData.password || !registerData.email) {
          setAuthError('Por favor completa todos los campos obligatorios');
          return;
      }

      setIsProcessing(true);
      try {
          await register(registerData);
          setUserMode('client'); // New normal users are clients
          setView('main');
      } catch (error) {
          setAuthError(error);
      } finally {
          setIsProcessing(false);
      }
  }, [registerData, register]);

  const onDriverRegisterSubmit = useCallback(async (driverData) => {
      setIsProcessing(true);
      try {
          // In a real app, we would send the vehicle and document data to the backend
          // For now, we just register the user with all info including vehicle data
          await register(driverData);
          setUserMode('driver'); // Set mode to driver
          setView('main');
      } catch (error) {
          setAuthError(error);
      } finally {
          setIsProcessing(false);
      }
  }, [register]);

  const onLogout = useCallback(() => {
      logout();
      setAuthView('login');
      setLoginData({ user: '', password: '' });
      setRegisterData({ name: '', phone: '', email: '', user: '', password: '' });
  }, [logout]);

  const handleCartClick = useCallback(() => {
    if (getCartCount() === 0) {
      setShowEmptyCart(true);
    } else {
      setView('cart');
    }
  }, [getCartCount]);

  const acceptOrder = useCallback((order) => {
      setIncomingOrder(null);
      setActiveOrder(order);
      setDriverTab('active');
      setDeliveryStep(0);
  }, []);

  const handleLocationConfirm = useCallback((newAddress, label) => {
      const addressObj = { label: label || 'Casa', address: newAddress };
      
      // Save address to user profile
      if (currentUser) {
          const updatedUser = { 
              ...currentUser, 
              addresses: [...(currentUser.addresses || []), addressObj] 
          };
          updateUserProfile(updatedUser);
      }

      setAddress(newAddress);
      
      if (returnToCheckout) {
        setView('checkout');
        setReturnToCheckout(false);
      } else {
        setView('main');
      }
  }, [currentUser, updateUserProfile, returnToCheckout]);

  const handleChangeAddressFromCheckout = useCallback(() => {
    setReturnToCheckout(true);
    setView('address-selection');
  }, []);

  const handleAddressSelect = useCallback((selectedAddressObj) => {
      setAddress(selectedAddressObj.address);
      if (returnToCheckout) {
          setView('checkout');
          setReturnToCheckout(false);
      } else {
          setView('main');
      }
  }, [returnToCheckout]);

  const placeOrder = useCallback(() => {
      if (getCartCount() === 0) return;

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemsSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
      
      const newOrder = {
          id: Date.now().toString(),
          userId: currentUser?.id, // Associate order with user
          restaurant: selectedRestaurant ? selectedRestaurant.name : 'Restaurante',
          image: selectedRestaurant ? selectedRestaurant.image : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=100&q=80',
          date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          status: 'En camino',
          items: itemsSummary,
          price: total
      };

      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('chaskys_orders', JSON.stringify(updatedOrders));
      
      clearCart();
      setView('main');
  }, [cart, currentUser, selectedRestaurant, orders, clearCart, getCartCount]);

  // --- AI INTEGRATION (MOCK) ---
  const handleAskChef = useCallback(() => {
      setIsAILoading(true);
      setTimeout(() => {
          setIsAILoading(false);
          setAiResponse(`¡Hola! Para "${aiPrompt}", te recomiendo probar la "Burger Kingpin" 🍔. Es una de las favoritas y tiene un precio genial hoy. ¿Te gustaría ver el menú?`);
      }, 2000);
  }, [aiPrompt]);

  const handleMotivateDriver = useCallback(() => {
      setIsAILoading(true);
      setTimeout(() => {
          setIsAILoading(false);
          const phrases = [
              "¡Vamos Jhefferson! Estás a 2 pedidos de tu meta diaria. 🚀",
              "Tu calificación es excelente, ¡sigue así! ⭐",
              "Recuerda hidratarte, hoy hace calor. 🥤",
              "El tráfico está ligero por la Av. Arequipa, aprovecha. 🛵"
          ];
          setDriverMotivation(phrases[Math.floor(Math.random() * phrases.length)]);
      }, 1500);
  }, []);

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-200">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center font-sans py-10">
      {/* iPhone 16 Pro Max Dimensions: ~440x956px */}
      <div className="w-[440px] h-[956px] bg-[#f8fafc] shadow-2xl relative overflow-hidden rounded-[3.5rem] ring-8 ring-slate-900/5 transform-gpu z-0">
        <div className="w-full h-full overflow-y-auto scrollbar-hide">
            {showSplash ? (
                <SplashScreen onComplete={() => setShowSplash(false)} />
            ) : !isAuthenticated ? (
                authView === 'driver-register' ? (
                    <DriverRegisterView 
                        onBack={() => setAuthView('login')}
                        onRegister={onDriverRegisterSubmit}
                        isProcessing={isProcessing}
                    />
                ) : (
                    <AuthView 
                        authView={authView} 
                        setAuthView={setAuthView} 
                        handleLogin={onLoginSubmit} 
                        handleRegister={onRegisterSubmit} 
                        loginData={loginData} 
                        setLoginData={setLoginData} 
                        registerData={registerData} 
                        setRegisterData={setRegisterData} 
                        isProcessing={isProcessing}
                        authError={authError}
                        setAuthError={setAuthError}
                    />
                )
            ) : (
            <>  
                {userMode === 'client' ? (
                    <>
                        {activeTab === 'home' && view === 'main' && (
                          <ClientHomeView 
                            user={currentUser}
                            setActiveTab={setActiveTab} 
                            setSelectedRestaurant={setSelectedRestaurant} 
                            setView={setView} 
                            isAIModalOpen={isAIModalOpen} 
                            setIsAIModalOpen={setIsAIModalOpen} 
                            aiPrompt={aiPrompt} 
                            setAiPrompt={setAiPrompt} 
                            aiResponse={aiResponse} 
                            setAiResponse={setAiResponse} 
                            isAILoading={isAILoading} 
                            handleAskChef={handleAskChef}
                            address={address}
                            onAddressClick={() => setView('location-picker')}
                            onRestaurantClick={(restaurant) => {
                              setSelectedRestaurant(restaurant);
                              setView('restaurant');
                            }}
                            cartCount={getCartCount()}
                            onCartClick={handleCartClick}
                          />
                        )}
                        {view === 'restaurant' && selectedRestaurant && (
                          <RestaurantDetailView 
                            restaurant={selectedRestaurant} 
                            setView={setView} 
                          />
                        )}
                        {view === 'cart' && (
                            <ClientCartView 
                                setView={setView} 
                                restaurant={selectedRestaurant}
                            />
                        )}
                        {view === 'checkout' && (
                            <ClientCheckoutView 
                                setView={setView} 
                                address={address}
                                placeOrder={placeOrder}
                                onChangeAddress={handleChangeAddressFromCheckout}
                            />
                        )}
                        {view === 'location-picker' && (
                            <LocationPickerView 
                                onBack={() => setView('address-selection')}
                                onConfirm={handleLocationConfirm}
                            />
                        )}
                        {view === 'address-selection' && (
                            <AddressSelectionView 
                                savedAddresses={currentUser?.addresses || []}
                                onSelectAddress={handleAddressSelect}
                                onAddNewAddress={() => setView('location-picker')}
                                onBack={() => {
                                    if (returnToCheckout) {
                                        setView('checkout');
                                        setReturnToCheckout(false);
                                    } else {
                                        setView('main');
                                    }
                                }}
                            />
                        )}
                        {activeTab === 'search' && (
                          <ClientSearchView 
                            setActiveTab={setActiveTab} 
                            setSelectedRestaurant={setSelectedRestaurant} 
                            setView={setView}
                          />
                        )} 
                        {activeTab === 'promotions' && (
                          <ClientPromotionsView />
                        )}
                        {activeTab === 'orders' && (
                          <ClientOrdersView orders={orders.filter(o => o.userId === currentUser?.id)} />
                        )} 
                        {activeTab === 'profile' && (
                          <ProfileView 
                            isDriverMode={false} 
                            setDriverTab={setDriverTab} 
                            setActiveTab={setActiveTab} 
                            userMode={userMode} 
                            setUserMode={setUserMode} 
                            handleLogout={onLogout}
                            currentUser={currentUser}
                            setCurrentUser={updateUserProfile} // ProfileView expects setter but we pass updater
                            updateUserProfile={updateUserProfile}
                            onAddAddress={() => setView('location-picker')}
                          />
                        )}
                    </>
                ) : (
                    <>
                        {driverTab === 'dashboard' && (
                            <DriverDashboard 
                              handleMotivateDriver={handleMotivateDriver} 
                              isAILoading={isAILoading} 
                              driverMotivation={driverMotivation} 
                              setIncomingOrder={setIncomingOrder} 
                              acceptOrder={acceptOrder}
                              AVAILABLE_ORDERS={AVAILABLE_ORDERS}
                              onOnlineStatusChange={setIsDriverOnline}
                            />
                        )}
                        {driverTab === 'available' && (
                          <DriverOrderHistoryView 
                            handleMotivateDriver={handleMotivateDriver} 
                            isAILoading={isAILoading} 
                            driverMotivation={driverMotivation} 
                            setDriverTab={setDriverTab}
                          />
                        )} 
                        {driverTab === 'active' && (
                          <DriverActiveOrder 
                            activeOrder={activeOrder} 
                            setDriverTab={setDriverTab} 
                            setActiveOrder={setActiveOrder} 
                            deliveryStep={deliveryStep} 
                            setDeliveryStep={setDeliveryStep}
                          />
                        )}
                        {driverTab === 'profile' && (
                          <ProfileView 
                            isDriverMode={true} 
                            setDriverTab={setDriverTab} 
                            setActiveTab={setActiveTab} 
                            userMode={userMode} 
                            setUserMode={setUserMode} 
                            handleLogout={onLogout}
                            currentUser={currentUser}
                            setCurrentUser={updateUserProfile}
                            updateUserProfile={updateUserProfile}
                            onSectionChange={setIsProfileSectionActive}
                          />
                        )}
                        <IncomingOrderModal 
                          incomingOrder={incomingOrder} 
                          setIncomingOrder={setIncomingOrder} 
                          acceptOrder={acceptOrder}
                        />
                    </>
                )}
            </>
        )}
        
        {/* Empty Cart Modal */}
        {showEmptyCart && (
            <EmptyCartModal onClose={() => setShowEmptyCart(false)} />
        )}

        {/* Navigation */}
        {isAuthenticated && (
            userMode === 'client' 
            ? (view !== 'cart' && view !== 'checkout' && (
                <ClientBottomNav 
                  activeTab={activeTab} 
                  view={view} 
                  setActiveTab={setActiveTab} 
                  setView={setView} 
                  cartItemsCount={getCartCount()}
                />
              ))
            : (driverTab !== 'active' && !isDriverOnline && !isProfileSectionActive && (
                <DriverBottomNav 
                  driverTab={driverTab} 
                  setDriverTab={setDriverTab} 
                  activeOrder={activeOrder}
                />
              ))
        )}
        </div>
      </div>
    </div>
  );
}

export default function FoodDeliveryApp() {
    return (
        <AuthProvider>
            <CartProvider>
                <AppContent />
            </CartProvider>
        </AuthProvider>
    );
}