export const LineSkeleton = ({
  width = '100%',
}: {
  width?: number | string;
}) => <div className="skeleton pulse skel-line" style={{ width }} />;

export const TitleSkeleton = ({
  width = '60%',
}: {
  width?: number | string;
}) => <div className="skeleton pulse skel-title" style={{ width }} />;

export const ChipSkeleton = () => <span className="skeleton pulse skel-chip" />;

export const BoxSkeleton = ({ height = 40 }: { height?: number }) => (
  <div className="skeleton pulse" style={{ height }} />
);
