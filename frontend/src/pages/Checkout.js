import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: confirmation
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    email: '',
    phone: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para crear la orden en la API
    setStep(3); // Simulamos que el pedido fue exitoso
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center text-blue-600 relative">
            <div
              className={`rounded-full h-12 w-12 flex items-center justify-center
                ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              1
            </div>
            <div className={`absolute pt-8 text-xs ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
              Shipping
            </div>
          </div>

          <div className="flex-auto border-t-2 border-gray-300 relative">
            <div
              className={`w-4 h-4 rounded-full absolute left-0 top-0 -mt-2 -ml-2
                ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}
            ></div>
          </div>

          <div className="flex items-center text-blue-600 relative">
            <div
              className={`rounded-full h-12 w-12 flex items-center justify-center
                ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              2
            </div>
            <div className={`absolute pt-8 text-xs ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
              Payment
            </div>
          </div>

          <div className="flex-auto border-t-2 border-gray-300 relative">
            <div
              className={`w-4 h-4 rounded-full absolute left-0 top-0 -mt-2 -ml-2
                ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}
            ></div>
          </div>

          <div className="flex items-center relative">
            <div
              className={`rounded-full h-12 w-12 flex items-center justify-center
                ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              3
            </div>
            <div className={`absolute pt-8 text-xs ${step >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
              Confirm
            </div>
          </div>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>

            {/* Resumen del pedido */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="bg-white rounded-xl shadow-md p-6">
                <ul className="divide-y divide-gray-200 mb-4">
                  <li className="py-3 flex justify-between">
                    <span>Laptop Pro x1</span>
                    <span>$1,200.00</span>
                  </li>
                  <li className="py-3 flex justify-between">
                    <span>Wireless Headphones x2</span>
                    <span>$300.00</span>
                  </li>
                  <li className="py-3 flex justify-between">
                    <span>Smart Watch x1</span>
                    <span>$250.00</span>
                  </li>
                </ul>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$1,750.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$175.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$140.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>$2,065.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold mb-2">Shipping Information</h3>
                <p className="text-gray-600 text-sm">
                  Free shipping on orders over $100. Standard shipping takes 3-5 business days.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Name on Card</label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>

            {/* Resumen del pedido */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="bg-white rounded-xl shadow-md p-6">
                <ul className="divide-y divide-gray-200 mb-4">
                  <li className="py-3 flex justify-between">
                    <span>Laptop Pro x1</span>
                    <span>$1,200.00</span>
                  </li>
                  <li className="py-3 flex justify-between">
                    <span>Wireless Headphones x2</span>
                    <span>$300.00</span>
                  </li>
                  <li className="py-3 flex justify-between">
                    <span>Smart Watch x1</span>
                    <span>$250.00</span>
                  </li>
                </ul>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$1,750.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$175.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$140.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>$2,065.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-xl p-6">
                <h3 className="font-bold mb-2">Shipping Information</h3>
                <p className="text-gray-600 text-sm">
                  Free shipping on orders over $100. Standard shipping takes 3-5 business days.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Thank you for your order! Your order number is #ORD-789456123.
              We've sent a confirmation email to {shippingInfo.email}.
            </p>

            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto mb-8">
              <h3 className="text-xl font-bold mb-4">Order Details</h3>

              <div className="grid grid-cols-2 gap-4 text-left mb-6">
                <div>
                  <h4 className="font-semibold">Shipping Address</h4>
                  <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.zipCode}, {shippingInfo.country}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Contact</h4>
                  <p>{shippingInfo.email}</p>
                  <p>{shippingInfo.phone}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span>$2,065.00</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                View Order History
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Checkout;