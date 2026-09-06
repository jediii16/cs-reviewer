import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BappiMascot, type BappiPose } from './BappiMascot';

const ROLL_STEP_INTERVAL_MS = 900;
const STARTLE_DURATION_MS = 1_200;

interface RollingStep {
  pose: BappiPose;
  alt: string;
  x: number;
  rotation: number;
}

const rollingSteps: RollingStep[] = [
  { pose: 'happy', alt: 'Bappi, a cheerful kimbap mascot', x: -38, rotation: 0 },
  { pose: 'thinking', alt: 'Bappi is thinking', x: -18, rotation: 90 },
  { pose: 'scared', alt: 'Bappi looks startled', x: 4, rotation: 180 },
  { pose: 'cool', alt: 'Bappi looks cool', x: 26, rotation: 270 },
  { pose: 'happy', alt: 'Bappi, a cheerful kimbap mascot', x: 42, rotation: 360 },
  { pose: 'focused', alt: 'Bappi is focused', x: 26, rotation: 270 },
  { pose: 'scared', alt: 'Bappi looks startled', x: 4, rotation: 180 },
  { pose: 'thinking', alt: 'Bappi is thinking', x: -18, rotation: 90 },
];

export function RoamingBappi() {
  const [rollStep, setRollStep] = useState(0);
  const [isStartled, setIsStartled] = useState(false);
  const recoveryTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const rollTimer = window.setInterval(() => {
      setRollStep((currentStep) => (currentStep + 1) % rollingSteps.length);
    }, ROLL_STEP_INTERVAL_MS);

    return () => window.clearInterval(rollTimer);
  }, []);

  useEffect(() => () => window.clearTimeout(recoveryTimer.current), []);

  const startleBappi = () => {
    window.clearTimeout(recoveryTimer.current);
    setIsStartled(true);
    recoveryTimer.current = window.setTimeout(() => setIsStartled(false), STARTLE_DURATION_MS);
  };

  const step = rollingSteps[rollStep];
  const currentExpression = isStartled
    ? { pose: 'scared' as const, alt: 'Bappi looks startled' }
    : step;
  const rollStyle = {
    '--bappi-x': `${step.x}px`,
    '--bappi-roll': `${step.rotation}deg`,
  } as CSSProperties;

  return (
    <div className="bappi-playground">
      <button
        className="bappi-roamer"
        type="button"
        aria-label="Play with Bappi"
        data-roll-step={rollStep}
        data-startled={isStartled}
        onClick={startleBappi}
        style={rollStyle}
      >
        <BappiMascot
          className="home-mascot"
          pose={currentExpression.pose}
          alt={currentExpression.alt}
          eager
        />
      </button>
    </div>
  );
}
