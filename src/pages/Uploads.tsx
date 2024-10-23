import CardDataStats from '../components/CardDataStats';
import { GoDeviceCameraVideo } from 'react-icons/go';
import { PiExam } from 'react-icons/pi';
import { MdOutlineSpeakerNotes, MdOutlineTopic } from 'react-icons/md';
import { FaBook } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Uploads = () => {
  return (
    <div className='flex items-center justify-center'>
      {/* <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4 xl:grid-cols-4 2xl:gap-7.5"> */}
      <div className="flex items-center gap-6 flex-wrap">
        <Link to="/upload_video">
          <CardDataStats title="" total="Upload Videos" rate="0.43%" levelUp>
            <GoDeviceCameraVideo />
          </CardDataStats>
        </Link>

        <Link to="/upload_test">
          <CardDataStats title="" total="Upload Test" rate="4.35%" levelUp>
            <PiExam />
          </CardDataStats>
        </Link>

        <Link to="/upload_notes">
          <CardDataStats title="" total="Upload Notes" rate="2.59%" levelUp>
            <MdOutlineSpeakerNotes />
          </CardDataStats>
        </Link>
        {/* <Link to="/upload_pdf">
        <CardDataStats title="" total="Upload PDFs" rate="0.95%" levelDown>
          <FaFilePdf />
        </CardDataStats>
      </Link> */}
        <Link to="/create_course">
          <CardDataStats title="" total="Create-Course" rate="0.43%" levelUp>
            <FaBook />
          </CardDataStats>
        </Link>

        <Link to="/create_topic">
          <CardDataStats title="" total="Create-Topic" rate="4.35%" levelUp>
            <MdOutlineTopic />
          </CardDataStats>
        </Link>
      </div>
    </div>
  );
};

export default Uploads;
