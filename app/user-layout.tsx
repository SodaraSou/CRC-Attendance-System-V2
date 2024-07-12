export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-w-screen">{children}</main>;
}
