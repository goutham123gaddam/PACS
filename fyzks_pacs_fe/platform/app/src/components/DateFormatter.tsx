import React from 'react';
import moment from 'moment';

interface DateFormatterProps {
  date: string | Date;
  format?: string;
}

const DateFormatter: React.FC<DateFormatterProps> = ({ date, format = 'DD MMM, YYYY' }) => {
  if (!date) {
    return <>-</>;
  }

  return <>{moment(date).format(format)}</>;
};

export default DateFormatter;