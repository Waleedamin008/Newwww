import React, { useState } from 'react';
import Header from './components/Header';
import CountdownCandleScreen from './components/CountdownCandleScreen';
import FireworksScreen from './components/FireworksScreen';
import CategoriesScreen from './components/CategoriesScreen';
import WishesDetailScreen from './components/WishesDetailScreen';
import MiniGameScreen from './components/MiniGameScreen';
import BottomNav from './components/BottomNav';
import { WISH_CATEGORIES } from './data/wishes';
import { sound } from './utils/sound';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('screen-1');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [unlockedNav, setUnlockedNav] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Screen 1: Blow candle completed -> go to fireworks
  const handleCandleBlown = () => {
    setCurrentScreen('screen-2');
  };

  // Screen 2: Fireworks completed / explore clicked -> go to categories
  const handleFireworksExplore = () => {
    setCurrentScreen('screen-3');
    setUnlockedNav(true);
    sound.startBirthdayMusic();
  };

  // Screen 3: Category selected -> go to detail
  const handleSelectCategory = (index) => {
    setSelectedCategoryIndex(index);
    setCurrentScreen('screen-4');
  };

  // Screen 4: Advance to next category
  const handleNextCategory = () => {
    sound.playTwinkleSound(660);
    setSelectedCategoryIndex((prev) => (prev + 1) % WISH_CATEGORIES.length);
  };

  return (
    <div className="app-container">
      <Header isMuted={isMuted} setIsMuted={setIsMuted} />

      <main className="main-content">
        {currentScreen === 'screen-1' && (
          <CountdownCandleScreen onComplete={handleCandleBlown} />
        )}

        {currentScreen === 'screen-2' && (
          <FireworksScreen onNext={handleFireworksExplore} />
        )}

        {currentScreen === 'screen-3' && (
          <CategoriesScreen
            onSelectCategory={handleSelectCategory}
            onOpenGame={() => setCurrentScreen('screen-5')}
          />
        )}

        {currentScreen === 'screen-4' && (
          <WishesDetailScreen
            categoryIndex={selectedCategoryIndex}
            onBack={() => setCurrentScreen('screen-3')}
            onNextCategory={handleNextCategory}
          />
        )}

        {currentScreen === 'screen-5' && (
          <MiniGameScreen onBack={() => setCurrentScreen('screen-3')} />
        )}
      </main>

      {unlockedNav && (
        <BottomNav
          activeScreen={currentScreen}
          onSelectScreen={(screenId) => setCurrentScreen(screenId)}
        />
      )}
    </div>
  );
}
