import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [startDay, setStartDay] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    setDaysInMonth(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // Get the start day of the month
    const startDay = new Date(year, month, 1).getDay();
    setStartDay(startDay);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return (
    <>
      <Breadcrumb pageName="Calendar" />
      
      {/* Calendar Header */}
      <div className="w-full max-w-full rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-4">
        <div className="flex items-center justify-between p-4 bg-primary text-white rounded-t-3xl">
          <span className="text-lg font-semibold">{currentMonth} {currentYear}</span>
        </div>
      </div>

      {/* <!-- ====== Calendar Section Start ====== --> */}
      <div className="w-full max-w-full rounded-3xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">Sun</th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Mon</th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Tue</th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Wed</th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Thu</th>
              <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Fri</th>
              <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">Sat</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(Math.ceil((daysInMonth.length + startDay) / 7)).keys()].map(rowIndex => (
              <tr key={rowIndex} className="grid grid-cols-7">
                {[...Array(7).keys()].map(colIndex => {
                  const dayIndex = rowIndex * 7 + colIndex - startDay;
                  const dayNumber = dayIndex + 1;
                  const isCurrentDay = dayNumber === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                  return (
                    <td key={colIndex} className={`ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31 ${isCurrentDay ? 'bg-primary text-white' : ''}`}>
                      <span className={`font-medium ${isCurrentDay ? 'text-white' : 'text-black'} dark:text-white`}>
                        {dayNumber > 0 && dayNumber <= daysInMonth.length ? dayNumber : ''}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <!-- ====== Calendar Section End ====== --> */}
    </>
  );
};

export default Calendar;
