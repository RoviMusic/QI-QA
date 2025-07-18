import Image from "next/image";

type LogoProps = {
  width?: number;
  height?: number;
};

function RoviLogo({ width = 150, height = 150 }: LogoProps) {
  return (
    <>
      <Image src="/Logo.jpg" alt="Logo" width={width} height={height} />
    </>
  );
}

function LogoAlt({width = 150, height = 100}: LogoProps){
  return(
    <>
    <Image src="/pngLogo.png" alt="Logo" width={width} height={height}/>
    </>
  )
}

export {RoviLogo, LogoAlt}
