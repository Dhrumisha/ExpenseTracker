import Navbar from "@/components/Navbar/Navbar";
import TransitionWrapper from "@/components/TransitionWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <TransitionWrapper>
        {/* <div className="p-5"> */}
          <main className="p-6">{children}</main>
        {/* </div> */}
      </TransitionWrapper>
    </>
  );
}
