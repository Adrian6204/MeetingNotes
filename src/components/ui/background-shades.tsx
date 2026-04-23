"use client"

import { LiquidMetal } from "@paper-design/shaders-react"
import { motion } from "framer-motion"

export default function ShadersBackground() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div 
        aria-hidden 
        style={{ 
          pointerEvents: 'none', 
          position: 'fixed', 
          inset: 0, 
          zIndex: -10 
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%' }}
          initial={{ opacity: 0.4, scale: 1 }}
          animate={{ opacity: 0.6, scale: 1.05, rotate: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
        >
          <LiquidMetal
            style={{ width: "100%", height: "100%", filter: "blur(8px)" }}
            colorBack="hsl(220, 40%, 2%)"
            colorTint="hsl(217, 91%, 60%)"
            repetition={3}
            softness={0.7}
            shiftRed={0.1}
            shiftBlue={0.5}
            distortion={0.15}
            contour={1.2}
            shape="none"
            offsetX={0}
            offsetY={0}
            scale={1.2}
            rotation={15}
            speed={0.3}
          />
        </motion.div>
      </div>
    </div>
  )
}
