import type { LucideProps } from "lucide-react";
import { Check, X, ShieldCheck, Clock, Home, Award, ClipboardList, Instagram } from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Check, X, ShieldCheck, Clock, Home, Award, ClipboardList, Instagram,
};

export const DynamicIcon = ({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} style={style} />;
};
