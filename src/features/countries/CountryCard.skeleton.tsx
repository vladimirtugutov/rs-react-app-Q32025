export const CountryCardSkeleton = () => {
  return (
    <section
      style={{
        padding: 16,
        marginBottom: 16,
        border: '1px solid #2e2e2e',
        borderRadius: 12,
        background: '#141414',
      }}
    >
      <div
        className="skeleton shimmer sk-title"
        style={{ width: '40%', marginBottom: 8 }}
      />
      <div
        className="skeleton shimmer sk-line"
        style={{ width: '30%', marginBottom: 16 }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 160px 160px 160px',
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div className="skeleton shimmer sk-line" />
        <div className="skeleton shimmer sk-line" />
        <div className="skeleton shimmer sk-line" />
        <div className="skeleton shimmer sk-line" />
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 160px 160px 160px',
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div className="skeleton shimmer sk-line" />
          <div className="skeleton shimmer sk-line" />
          <div className="skeleton shimmer sk-line" />
          <div className="skeleton shimmer sk-line" />
        </div>
      ))}
    </section>
  );
};
