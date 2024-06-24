import KeystaticApp from "./keystatic";
import { showAdminUI } from '../../../keystatic.config';
import { notFound } from 'next/navigation';

export default function Layout() {
  if (!showAdminUI) {
    notFound();
  }

  return (
    <KeystaticApp />
  );
}