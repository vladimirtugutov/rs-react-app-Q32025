export const HeaderSkeleton = () => {
  return (
    <div
      style={{
        padding: 16,
        position: 'sticky',
        top: 0,
        background: '#0f0f0f',
        zIndex: 1,
      }}
    >
      <div
        className="skeleton shimmer"
        style={{ height: 36, width: 320, borderRadius: 8 }}
      />
      <div style={{ height: 12 }} />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="skeleton shimmer sk-chip"
            style={{ borderRadius: 8 }}
          />
        ))}
      </div>
      <div style={{ height: 12 }} />
      <div
        className="skeleton shimmer"
        style={{ height: 36, width: 280, borderRadius: 8 }}
      />
    </div>
  );
};
