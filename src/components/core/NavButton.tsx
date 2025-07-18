import { Button } from "antd";
import { usePathname } from "next/navigation";
import { CSSProperties, ReactNode, useEffect, useState } from "react";
import styles from "@/styles/NavButton.module.css";

import { AreaType } from "@/shared/types/menuTypes";

type NavButtonProps = {
  children: ReactNode;
  area: AreaType
  style?: 'active' | 'inactive';
};

export default function NavButton({ children, area, style }: NavButtonProps) {
  
  return (
    <>
      <Button
        type="text"
        className={style === 'active' ? styles.activeButton : ''}
      >
        {children}
      </Button>
    </>
  );
}
