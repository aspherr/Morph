import { useTheme } from "next-themes";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const { resolvedTheme } = useTheme();
  const animationDuration = `${speed}s`;

  const gradient = resolvedTheme === "dark"
  ? "rgba(255, 255, 255, 0.8) 50%"
  : "rgba(0,0,0, 0.8) 50%"

  return (
    <div
      className={`text-[#252424a4] dark:text-[#b5b5b5a4] bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        backgroundImage: 
        `linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, ${gradient}, rgba(255, 255, 255, 0) 60%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: animationDuration
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;


