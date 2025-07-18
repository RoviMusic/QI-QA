"use client";
import { Typography } from "antd";
import { CSSProperties, PropsWithChildren, ReactNode } from "react";
const { Title, Text } = Typography;
declare const TITLE_ELE_LIST: readonly [1, 2, 3, 4, 5];

type TitleProps = {
  children: ReactNode;
  style?: CSSProperties;
  level?: (typeof TITLE_ELE_LIST)[number];
};

function MainTitle({ children }: PropsWithChildren) {
  return (
    <>
      <Title level={2} className="font-bold text-primary">
        {children}
      </Title>
    </>
  );
}

function DefaultTitle({ children, style, level = 5 }: TitleProps) {
  return (
    <Title level={level} style={style}>
      {children}
    </Title>
  );
}

function Subtitle({ children }: PropsWithChildren) {
  return (
    <Title level={3} style={{ marginTop: 0, fontWeight: 600 }}>
      {children}
    </Title>
  );
}

function MutedSubtitle({ children }: PropsWithChildren) {
  return (
    <>
      <h4 className="text-ring">{children}</h4>
    </>
  );
}

function LabelTitle({children}: PropsWithChildren){
    return(
        <>
        <Text className="font-bold">{children}</Text>
        </>
    )
}

export { MainTitle, Subtitle, DefaultTitle, MutedSubtitle, LabelTitle };
