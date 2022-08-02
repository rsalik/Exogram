import { Link as ReactLink } from 'react-router-dom';

export default function Link(props: {
  href: string;
  borderless?: boolean;
  newTab?: boolean;
  external?: boolean;
  children: React.ReactNode;
}) {
  return props.external ? (
    <a
      href={props.href}
      className={`${props.borderless ? 'borderless-' : ''}link`}
      rel={'noreferrer'}
      target={props.newTab ? '_blank' : '_self'}
    >
      {props.children}
    </a>
  ) : (
    <ReactLink to={props.href} className={`${props.borderless ? 'borderless-' : ''}link`}>
      {props.children}
    </ReactLink>
  );
}
