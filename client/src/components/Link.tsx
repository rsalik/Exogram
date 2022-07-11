export default function Link(props: { href: string; borderless?: boolean; newTab?: boolean; children: React.ReactNode }) {
  return (
    <a
      href={props.href}
      className={`${props.borderless ? 'borderless-' : ''}link`}
      target={props.newTab ? '_blank' : '_self'}
      rel={'noreferrer'}
    >
      {props.children}
    </a>
  );
}
