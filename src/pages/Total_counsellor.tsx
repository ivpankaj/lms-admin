
import { Link } from 'react-router-dom';
import BrandOne from '../images/brand/brand-01.svg';
import BrandTwo from '../images/brand/brand-02.svg';
import BrandThree from '../images/brand/brand-03.svg';
import BrandFour from '../images/brand/brand-04.svg';
import BrandFive from '../images/brand/brand-05.svg';
import { BRAND } from '../types/brand';

const brandData: BRAND[] = [
  {
    logo: BrandOne,
    name: 'Vikram',
    id: 1,
  },
  {
    logo: BrandTwo,
    name: 'Pankaj',
    id: 2,
  },
  {
    logo: BrandThree,
    name: 'Muskan',
    id: 3,
  },
  {
    logo: BrandFour,
    name: 'Sanjeev',
    id: 4,
  },
  {
    logo: BrandFive,
    name: 'Ayush',
    id: 5,
  },
];

const Total_counsellor = () => {
  return (
    <div className="rounded-3xl border border-stroke bg-white p-4 shadow-lg dark:border-strokedark dark:bg-boxdark sm:p-6 lg:p-8">
      <h4 className="mb-4 text-lg font-semibold text-black dark:text-white sm:mb-6 sm:text-xl">
        Total Counsellor
      </h4>

      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-3 gap-4 rounded-3xl bg-gray-100 dark:bg-meta-4 sm:grid-cols-5 sm:gap-6">
          <div className="p-2 text-left sm:p-4">
            <h5 className="text-xs font-medium uppercase text-gray-700 dark:text-gray-300 sm:text-sm">
              Name
            </h5>
          </div>
          <div className="p-2 text-center sm:p-4">
            <h5 className="text-xs font-medium uppercase text-gray-700 dark:text-gray-300 sm:text-sm">
              ID
            </h5>
          </div>
          <div className="p-2 text-center sm:p-4 sm:col-span-2 lg:col-span-1">
            <h5 className="text-xs font-medium uppercase text-gray-700 dark:text-gray-300 sm:text-sm">
              Actions
            </h5>
          </div>
        </div>

        {brandData.map((brand) => (
          <div
            className="grid grid-cols-3 gap-4 items-center border-b border-stroke dark:border-strokedark sm:grid-cols-5 sm:gap-6 last:border-none"
            key={brand.id}
          >
            <div className="flex items-center gap-2 p-2 sm:gap-3 sm:p-4">
              <img src={brand.logo} alt={brand.name} className="h-6 w-6 sm:h-8 sm:w-8" />
              <p className="text-xs text-black dark:text-white sm:text-sm">{brand.name}</p>
            </div>
            <p className="text-center text-xs text-black dark:text-white sm:text-sm">
              {brand.id}
            </p>
            <div className="flex items-center justify-center p-2 sm:p-4 sm:col-span-2 lg:col-span-1">
              {/* <Link to='/profile'><button className="text-blue-500 text-xs hover:underline sm:text-sm">
                View details
              </button></Link> */}
              <Link to={`/profile/${brand.id}`}>
                <button className="text-blue-500 text-xs hover:underline sm:text-sm">
                  View details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Total_counsellor;
