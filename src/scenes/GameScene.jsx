import SceneTransition from '../components/SceneTransition';
import HeartGame from '../components/HeartGame';
import ParticleBackground from '../components/ParticleBackground';
import { birthdayData } from '../data/birthdayData';

export default function GameScene({ onNext }) {
  const { game } = birthdayData;

  return (
    <SceneTransition className="bg-gradient-to-b from-blush via-cream to-lavender/30">
      <ParticleBackground variant="day" density={15} />

      <div className="relative z-10 w-full h-full">
        <HeartGame
          instruction={game.instruction}
          unlockedMessage={game.unlocked}
          onComplete={onNext}
        />
      </div>
    </SceneTransition>
  );
}
