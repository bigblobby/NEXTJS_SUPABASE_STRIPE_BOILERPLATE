import { format, parseISO } from 'date-fns';

interface DateFormatterProps {
  dateString: string;
  formatStr?: string;
}

export default function DateFormatter({
  dateString,
  formatStr = 'LLLL	d, yyyy'
}: DateFormatterProps) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, formatStr)}</time>;
}