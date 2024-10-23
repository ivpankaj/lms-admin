import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { getApiUrl } from '../../env';
import { Link } from 'react-router-dom';

interface CourseRegistration {
  courseName: string;
  studentCount: number;
}

interface ChartFourState {
  series: number[];
  labels: string[];
  totalStudents: number;
  totalCourses: number;
}

const ChartFour: React.FC = () => {
  const [state, setState] = useState<ChartFourState>({
    series: [],
    labels: [],
    totalStudents: 0,
    totalCourses: 0,
  });

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
    labels: state.labels,
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  useEffect(() => {
    const api = getApiUrl();
    const fetchData = async () => {
      try {
        const response = await axios.get(`${api}/api/admin/dashboard/student/total/analytics`);
        const { totalStudents, totalCourses, courseRegistrations } = response.data;

        const labels = courseRegistrations.map((course: CourseRegistration) => course.courseName);
        const series = courseRegistrations.map((course: CourseRegistration) => course.studentCount);

        setState({
          series,
          labels,
          totalStudents,
          totalCourses,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-3xl border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Student Analytics
          </h5>
        </div>
        <div>
          <Link to={'total_students'}>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            View Analytics
          </h5>
          </Link>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartFour" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {state.labels.map((label, index) => (
          <div className="sm:w-1/2 w-full px-8" key={index}>
            <div className="flex w-full items-center">
              <span className={`mr-2 block h-3 w-full max-w-3 rounded-full bg-[#${index % 2 === 0 ? '3C50E0' : '6577F3'}]`}></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{label}</span>
                <span>{state.series[index]}%</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartFour;
