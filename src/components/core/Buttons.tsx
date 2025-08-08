import { getIcon } from "@/lib/utils";
import { Button, Tooltip } from "antd";
import { ReactNode } from "react";

type ButtonProps = {
  onPress: () => void;
  children?: ReactNode;
  icon?: string;
  disabled?: boolean | undefined;
  tooltip?: string;
  color?: string;
};

function CircleButton({ onPress, icon, tooltip, color }: ButtonProps) {
  return (
    <>
      <Tooltip title={tooltip}>
        <Button
          shape="circle"
          icon={getIcon(icon ?? "Default")}
          onClick={onPress}
          style={{color: color ?? ''}}
        />
      </Tooltip>
    </>
  );
}

function MainButton({
  onPress,
  icon,
  disabled = false,
  children,
}: ButtonProps) {
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

function LargeButton({ onPress, children }: ButtonProps) {
  return (
    <>
      <div
        className="bg-black text-white p-5 rounded-3xl text-center hover:bg-gray-700 hover:cursor-pointer"
        onClick={onPress}
      >
        {children}
      </div>
    </>
  );
}

export { CircleButton, MainButton, LargeButton };
