// src/app/[locale]/[page]/layout.tsx
export default function MasterDetailLayout({
  children, // левая часть
  details, // @details slot
}: {
  children: React.ReactNode;
  details: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 2 }}>{children}</div>
      {details && <div style={{ flex: 3 }}>{details}</div>}
    </div>
  );
}
