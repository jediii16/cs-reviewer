import celebrating from '../assets/bappi/bappi-celebrating.png';
import cool from '../assets/bappi/bappi-cool.png';
import focused from '../assets/bappi/bappi-focused.png';
import happy from '../assets/bappi/bappi-happy.png';
import scared from '../assets/bappi/bappi-scared.png';
import thinking from '../assets/bappi/bappi-thinking.png';
import worried from '../assets/bappi/bappi-worried.png';

export type BappiPose =
  | 'happy'
  | 'thinking'
  | 'cool'
  | 'focused'
  | 'celebrating'
  | 'worried'
  | 'scared';

const poseSources: Record<BappiPose, string> = {
  happy,
  thinking,
  cool,
  focused,
  celebrating,
  worried,
  scared,
};

interface BappiMascotProps {
  pose?: BappiPose;
  alt?: string;
  className?: string;
  eager?: boolean;
}

export function BappiMascot({
  pose = 'happy',
  alt = '',
  className = '',
  eager = false,
}: BappiMascotProps) {
  return (
    <img
      className={`bappi-mascot ${className}`.trim()}
      src={poseSources[pose]}
      alt={alt}
      decoding="async"
      loading={eager ? 'eager' : 'lazy'}
    />
  );
}
