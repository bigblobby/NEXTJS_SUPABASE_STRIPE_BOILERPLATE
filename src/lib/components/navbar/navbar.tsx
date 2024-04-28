import s from './navbar.module.css';

interface INavbarProps {
  children: React.ReactNode;
}

export default async function Navbar({
  children,
}: INavbarProps) {
  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto h-full">
        {children}
      </div>
    </nav>
  );
}
