import { Badge } from "antd";
type BadgeProps = {
  status: "default" | "warning" | "error" | "success";
  text: string;
};

export default function BadgeStatus({ status, text }: BadgeProps) {
  return (
    <>
      <Badge status={status} text={text} />
    </>
  );
}
