'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaCalendarCheck, FaUserMd, FaCreditCard } from 'react-icons/fa';
import Image from 'next/image';

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <FaRobot className="text-4xl text-primary" />,
      title: "AI Assistant",
      description: "24/7 intelligent chatbot support to answer your health queries instantly"
    },
    {
      icon: <FaCalendarCheck className="text-4xl text-primary" />,
      title: "Easy Scheduling",
      description: "Effortless appointment booking system with real-time availability"
    },
    {
      icon: <FaUserMd className="text-4xl text-primary" />,
      title: "Expert Doctors",
      description: "Access to qualified specialists across various medical fields"
    },
    {
      icon: <FaCreditCard className="text-4xl text-primary" />,
      title: "Flexible Plans",
      description: "Customizable subscription plans for healthcare providers"
    }
  ];

  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      image: "/doctors/doctor1.jpg"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      image: "/doctors/doctor2.jpg"
    },
    {
      name: "Dr. Emily Brown",
      specialty: "Pediatrics",
      image: "/doctors/doctor3.jpg"
    }
  ];

  const plans = [
    {
      name: "Basic",
      price: "$99/month",
      features: [
        "Up to 30 appointments/month",
        "Basic analytics",
        "Email support",
        "Basic profile customization"
      ]
    },
    {
      name: "Professional",
      price: "$199/month",
      features: [
        "Unlimited appointments",
        "Advanced analytics",
        "Priority support",
        "Full profile customization",
        "Custom availability settings"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "All Professional features",
        "Custom integration",
        "Dedicated account manager",
        "Training sessions",
        "Custom branding"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <motion.section 
        className="relative h-[80vh] flex items-center justify-center text-center px-4"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforming Healthcare Through Technology
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Connecting patients with expert healthcare providers through an innovative platform powered by AI
          </p>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Expert Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                <p className="text-4xl font-bold text-primary mb-8">{plan.price}</p>
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-8 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 