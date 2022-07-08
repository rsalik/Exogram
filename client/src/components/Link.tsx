export default function Link(props: { href: string; borderless?: boolean; children: React.ReactNode }) {
  return (
    <a href={props.href} className={`${props.borderless ? 'borderless-' : ''}link`}>
      {props.children}
    </a>
  );
}
