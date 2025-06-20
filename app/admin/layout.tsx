import { Nav, NavLink } from "@/components/Nav";
export const dynamic = "force-dynamic";
export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
      <Nav><NavLink href="/">Restaurant Logo</NavLink></Nav> 
      <div className="my-9 mx-6 sm:mx-auto sm:container">{children}</div>
    </>
  }