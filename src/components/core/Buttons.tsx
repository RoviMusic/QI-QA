import { getIcon } from "@/lib/utils";
import { Button } from "antd";
import { ReactNode } from "react";

type ButtonProps = {
  onPress: () => void;
  children?: ReactNode;
  icon?: string;
  disabled?: boolean | undefined;
};

function CircleButton({ onPress, icon }: ButtonProps) {
  return (
    <>
      <Button
        shape="circle"
        icon={getIcon(icon ?? "Default")}
        onClick={onPress}
      />
    </>
  );
}

function MainButton({ onPress, icon, disabled = false, children }: ButtonProps) {
  return (
    <Button
      onClick={onPress}
      disabled={disabled}
      icon={icon ? getIcon(icon) : null}
      type="primary"
    >
      {children}
    </Button>
  );
}

export { CircleButton, MainButton };
