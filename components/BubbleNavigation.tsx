import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Home, MapPin, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BubbleNavigationProps {
  onNavigate: (screen: 'home' | 'places' | 'map') => void;
  onCreateEntry: () => void;
}

export function BubbleNavigation({ onNavigate, onCreateEntry }: BubbleNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBubbleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleNavigation = (screen: 'home' | 'places' | 'map') => {
    onNavigate(screen);
    setIsExpanded(false);
  };

  const handleCreateEntry = () => {
    onCreateEntry();
    setIsExpanded(false);
  };

  const handleOverlayClick = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>

      {/* Navigation Bubbles */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isExpanded && (
            <>
              {/* Home */}
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: -80 }}
                exit={{ scale: 0, y: 20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="absolute bottom-0 right-0"
              >
                <Button
                  variant="default"
                  size="icon"
                  className="w-12 h-12 rounded-full shadow-lg"
                  onClick={() => handleNavigation('home')}
                >
                  <Home className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Places List */}
              <motion.div
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: 1, x: -80 }}
                exit={{ scale: 0, x: 20 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="absolute bottom-0 right-0"
              >
                <Button
                  variant="default"
                  size="icon"
                  className="w-12 h-12 rounded-full shadow-lg"
                  onClick={() => handleNavigation('places')}
                >
                  <MapPin className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ scale: 0, x: 20, y: 20 }}
                animate={{ scale: 1, x: -56, y: -56 }}
                exit={{ scale: 0, x: 20, y: 20 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="absolute bottom-0 right-0"
              >
                <Button
                  variant="default"
                  size="icon"
                  className="w-12 h-12 rounded-full shadow-lg"
                  onClick={() => handleNavigation('map')}
                >
                  <Map className="w-5 h-5" />
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Bubble */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="default"
            size="icon"
            className="w-16 h-16 rounded-full shadow-xl"
            onClick={isExpanded ? handleCreateEntry : handleBubbleClick}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </>
  );
}