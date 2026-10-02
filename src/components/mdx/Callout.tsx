import { AlertIcon, InfoIcon, SparkIcon } from "../icons";
import styles from "./mdx.module.css";

const ICONS = { info: InfoIcon, warning: AlertIcon, success: SparkIcon };

export default function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof ICONS;
  title?: string;
  children: React.ReactNode;
}) {
  const Icon = ICONS[type];
  return (
    <aside className={styles.callout} data-type={type}>
      <Icon className={styles.calloutIcon} size={22} />
      {title && <p className={styles.calloutTitle}>{title}</p>}
      <div className={styles.calloutBody}>{children}</div>
    </aside>
  );
}
