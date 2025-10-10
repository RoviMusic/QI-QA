import { Layout } from "antd";
import styles from "@/styles/MainLayout.module.css";
import MainHeader from "@/components/layout/MainHeader";
import MainContent from "@/components/layout/MainContent";
import AuthGuard from "@/components/AuthGuard";
import AlertModal from "@/components/core/Alerts";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //const session = await auth();

  //if(!session?.user) return redirect('/')

  return (
    <>
      <AuthGuard>
        <Layout hasSider className={styles.layout}>
          <Layout className={styles.meshLayout}>
            <MainHeader />
            {/* <pre>{session.user.name ?? 'hello'}</pre> */}
            <MainContent>{children}</MainContent>
          </Layout>
        </Layout>

        <AlertModal />
      </AuthGuard>
    </>
  );
}
