import { CSSProperties, ReactNode } from "react";
import styles from "@/styles/GlassCard.module.css";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  style?: CSSProperties;
}

export default function GlassCard({ children, style }: GlassCardProps) {
  return (
    <>
      <div style={style} className={styles.glass}>
        {children}
      </div>
    </>
  );
}
