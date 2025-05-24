import React from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  const stats = [
    { icon: "CheckCircle2", value: "0", label: "Tasks Completed", color: "text-green-500" },
    { icon: "Clock", value: "0", label: "Active Tasks", color: "text-blue-500" },
    { icon: "TrendingUp", value: "0%", label: "Productivity", color: "text-purple-500" },
    { icon: "Target", value: "0", label: "Goals Achieved", color: "text-orange-500" }
  ]

  return (
    <motion.div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          variants={itemVariants}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6 shadow-soft">
            <ApperIcon name="CheckSquare" size={32} className="text-white sm:w-10 sm:h-10" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent text-transparent bg-clip-text mb-4 leading-tight">
            TaskFlow
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto leading-relaxed">
            Transform your productivity with intelligent task management. 
            Organize, prioritize, and accomplish more than ever before.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 lg:mb-16"
          variants={itemVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-card transition-all duration-300 group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <ApperIcon name={stat.icon} className="w-full h-full" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-surface-600 dark:text-surface-400 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Feature Section */}
        <motion.div variants={itemVariants}>
          <MainFeature />
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          className="mt-16 lg:mt-20"
          variants={itemVariants}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
              Features That <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Empower</span>
            </h2>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Discover the tools that will revolutionize how you manage tasks and boost your productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: "Zap",
                title: "Smart Prioritization",
                description: "AI-powered task ranking to help you focus on what matters most",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                icon: "Calendar",
                title: "Intelligent Scheduling",
                description: "Automatic deadline tracking with smart reminder notifications",
                gradient: "from-blue-400 to-purple-500"
              },
              {
                icon: "BarChart3",
                title: "Progress Analytics",
                description: "Visual insights into your productivity patterns and achievements",
                gradient: "from-green-400 to-teal-500"
              },
              {
                icon: "Users",
                title: "Team Collaboration",
                description: "Share tasks and projects with seamless team coordination",
                gradient: "from-pink-400 to-red-500"
              },
              {
                icon: "Smartphone",
                title: "Cross-Platform Sync",
                description: "Access your tasks anywhere with real-time synchronization",
                gradient: "from-indigo-400 to-blue-500"
              },
              {
                icon: "Shield",
                title: "Secure & Private",
                description: "Enterprise-grade security to keep your data safe and private",
                gradient: "from-purple-400 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`inline-flex w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <ApperIcon name={feature.icon} size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Home