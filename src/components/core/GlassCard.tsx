import { CSSProperties, ReactNode } from "react";
import styles from "@/styles/GlassCard.module.css";

interface GlassCardProps{
  children: ReactNode;
  style?: CSSProperties;
  onPress?: () => void;
}

function GlassCard({ children, style }: GlassCardProps) {
  return (
    <>
      <div style={style} className={styles.glass}>
        {children}
      </div>
    </>
  );
}

function GlassCardHoverable({ children, style, onPress }: GlassCardProps) {
  return (
    <>
      <div style={style} className={styles.glassHoverable} onClick={onPress}>
        {children}
      </div>
    </>
  );
}

export { GlassCard, GlassCardHoverable };
