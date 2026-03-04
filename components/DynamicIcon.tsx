import * as Icons from "lucide-react";

export const DynamicIcon = ({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} style={style} />;
};
