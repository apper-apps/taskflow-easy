import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* 404 Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="flex justify-center"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-soft">
              <ApperIcon name="AlertTriangle" size={48} className="text-white sm:w-16 sm:h-16" />
            </div>
          </motion.div>

          {/* 404 Text */}
          <div>
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text mb-4">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 mb-8 leading-relaxed">
              Oops! The page you're looking for seems to have wandered off. 
              Let's get you back on track with your tasks.
            </p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 group"
              >
                <ApperIcon name="Home" size={20} className="group-hover:scale-110 transition-transform duration-300" />
                Return to TaskFlow
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/70 dark:bg-surface-800/70 text-surface-900 dark:text-surface-100 font-semibold rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 group backdrop-blur-sm border border-surface-200 dark:border-surface-700"
            >
              <ApperIcon name="ArrowLeft" size={20} className="group-hover:scale-110 transition-transform duration-300" />
              Go Back
            </motion.button>
          </div>

          {/* Decorative Elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex justify-center space-x-2 pt-8"
          >
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                style={{ animationDelay: `${dot * 0.2}s` }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound