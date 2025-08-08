'use client'
import { Layout } from "antd";
import styles from "@/styles/MainLayout.module.css";
import MainHeader from "@/components/layout/MainHeader";
import MainContent from "@/components/layout/MainContent";
import { useEffect } from "react";
import { localStorageService } from "@/shared/services/localStorageService";
import { useRouter } from "next/navigation";


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //const session = await auth();

  //if(!session?.user) return redirect('/')

  // const user = localStorageService.getItem('user')
  // console.warn('hola ', user)

  // if(user === null) return redirect('/')

  // const router = useRouter()
  // useEffect(() => {
  //   const currentUser = localStorageService.getItem('user')

  //   if(currentUser === null) {
  //     router.replace('/')
  //   }
  // }, [])

  return (
    <>
      <Layout hasSider className={styles.layout}>
        <Layout className={styles.meshLayout}>
          <MainHeader />
          {/* <pre>{session.user.name ?? 'hello'}</pre> */}
          <MainContent>{children}</MainContent>
        </Layout>
      </Layout>
    </>
  );
}
