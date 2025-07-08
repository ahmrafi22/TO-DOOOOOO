"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Press_Start_2P } from "next/font/google"
import { AuthDialog } from "@/components/auth-dialog"

const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"] })

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [showRhythm, setShowRhythm] = useState(false)
  const [hideOverflow, setHideOverflow] = useState(true)
  const router = useRouter()
  const letters = "TO-DOOOOOs".split("")

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }


    const rhythmTimer = setTimeout(() => {
      setShowRhythm(true)
    }, 1800)

    const overflowTimer = setTimeout(() => {
      setHideOverflow(false)
    }, 2200)

    return () => {
      clearTimeout(rhythmTimer)
      clearTimeout(overflowTimer)
    }
  }, [])

  const handleAuthSuccess = (userData) => {
    setUser(userData)
  }

  const handleGoToTodos = () => {
    router.push("/todo")
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const letterVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration: 0.8,
      },
    },
  }

  const rhythmVariants = {
    animate: (i) => ({
      y: [0, -15, 0, -8, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: i * 0.1,
        times: [0, 0.2, 0.4, 0.6, 1],
      },
    }),
  }

  return (
    <div
      className={`min-h-screen bg-gray-900 flex flex-col items-center justify-center relative ${hideOverflow ? "overflow-hidden" : ""}`}
    >
      {/* Main TODOOOOO Text */}
      <div className="flex items-center justify-center mb-8 px-4">
        <motion.div 
          className="flex flex-wrap justify-center" 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className={`${pressStart.className} text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white inline-block`}
              // @ts-ignore
              variants={letterVariants}
              custom={index}
            >
              <motion.span
                className="inline-block"
                // @ts-ignore
                variants={showRhythm ? rhythmVariants : {}}
                animate={showRhythm ? "animate" : ""}
                custom={index}
              >
                {letter}
              </motion.span>
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Authentication Section */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-[30vh] text-center px-4">
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-lg text-white mb-4 font-semibold">
              Welcome back, <span className="text-blue-400">{user.name}</span>!
            </p>
            <motion.button
              onClick={handleGoToTodos}
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter
            </motion.button>
          </motion.div>
        ) : (
          <AuthDialog onAuthSuccess={handleAuthSuccess}>
            <motion.button
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join
            </motion.button>
          </AuthDialog>
        )}
      </div>
    </div>
  )
}