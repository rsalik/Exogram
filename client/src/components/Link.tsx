import { Link as ReactLink } from 'react-router-dom';

export default function Link(props: { href: string; borderless?: boolean; newTab?: boolean; children: React.ReactNode }) {
  return (
    <ReactLink
      to={props.href}
      className={`${props.borderless ? 'borderless-' : ''}link`}
      target={props.newTab ? '_blank' : '_self'}
      rel={'noreferrer'}
    >
      {props.children}
    </ReactLink>
  );
}
