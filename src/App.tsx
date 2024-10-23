import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/StudentManagement';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import Uploads from './pages/Uploads';
import Video from './pages/Video';
import PDF from './pages/PDF';
import TableOne from './components/Tables/TableOne';
import Total_counsellor from './pages/Total_counsellor';
import Total_courses from './pages/Total_courses';
import TestPdf from './pages/TestMcq';
import NotesPdf from './pages/NotesPdf';
import CreateCoursePage from './pages/createCourse';
import CreateTopicPage from './pages/createTopic';
import CreateBatch from './pages/CreateBatch';
import ManageBatches from './pages/ManageBatches';
import CounsellorForm from './pages/Form/CounsellorForm';
import CounselorList from './pages/Form/CounsellorList';
import AdminProfile from './pages/Dashboard/AdminProfile';
import NotificationSender from './pages/Dashboard/NotificationSender';
import NotificationList from './pages/Dashboard/NotificationsAll';
import LayoutWrapper from './layout/LayoutWrapper';
import { getApiUrl } from './env';
import Meeting from './pages/Meeting';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);




//auto logout when user login on other device
  const apiUrl = getApiUrl();
  const token = Cookies.get('authToken')
  const location = useLocation();

const fetchData = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/admin/get`, {
      method: 'GET',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.status === 400 && data.message === 'Admin logout please go to login page') {
      // Remove the token from cookies
      Cookies.remove('authToken');
      handleShowAlert()
    } else {
      // Handle other responses or data
      console.log(data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


useEffect(()=>{
  fetchData();
},[location])


interface AlertPopupProps {
  message: string;
  onClose: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ message, onClose }) => {
  return (
    <>
      {/* Dark blurred overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Alert</h2>
          <p className="text-gray-700 mb-4">{message}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};



const [showAlert, setShowAlert] = useState(false);

const handleShowAlert = () => {
  setShowAlert(true);

  // Auto-hide the alert after a few seconds
  setTimeout(() => {
    setShowAlert(false);
  }, 7000); // Adjust time as needed
};


  return (
   <>
    
    {showAlert && (
        <AlertPopup
          message="You are logged in on another device. We are going to log you out. Thank you."
          onClose={() => setShowAlert(false)}
        />
      )}

   { loading ?(
    <Loader />
  
      ) : (
    <LayoutWrapper>
      <Routes>
        {token ? (
          <>
            <Route
              path="/"
              element={
                <>
                  <PageTitle title="eCommerce Dashboard | Admin - Skill On Time Admin Dashboard " />
                  <ECommerce />
                </>
              }
            />
            <Route
              path="/uploads"
              element={
                <>
                  <PageTitle title="Uploads | Admin - Skill On Time Admin Dashboard " />
                  <Uploads />
                </>
              }
            />
            <Route
              path="/upload_video"
              element={
                <>
                  <PageTitle title="Upload Video | Admin - Skill On Time Admin Dashboard " />
                  <Video />
                </>
              }
            />
            <Route
              path="/upload_test"
              element={
                <>
                  <PageTitle title="Upload Test | Admin - Skill On Time Admin Dashboard " />
                  <TestPdf />
                </>
              }
            />
            <Route
              path="/upload_pdf"
              element={
                <>
                  <PageTitle title="Upload PDF | Admin - Skill On Time Admin Dashboard " />
                  <PDF />
                </>
              }
            />
            <Route
              path="/upload_notes"
              element={
                <>
                  <PageTitle title="Upload Notes | Admin - Skill On Time Admin Dashboard " />
                  <NotesPdf />
                </>
              }
            />
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Calendar | Admin - Skill On Time Admin Dashboard " />
                  <Calendar />
                </>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <>
                  <PageTitle title="Profile | Admin - Skill On Time Admin Dashboard " />
                  <Profile />
                </>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <>
                  <PageTitle title="Profile | Admin - Skill On Time Admin Dashboard " />
                  <AdminProfile />
                </>
              }
            />
            <Route
              path="/messages"
              element={
                <>
                  <PageTitle title="Messages | Admin - Skill On Time Admin Dashboard " />
                  <NotificationSender />
                </>
              }
            />
            <Route
              path="/notifications/all"
              element={
                <>
                  <PageTitle title="Notifications | Admin - Skill On Time Admin Dashboard " />
                  <NotificationList />
                </>
              }
            />
            <Route
              path="/total_students"
              element={
                <>
                  <PageTitle title="Total Students | Admin - Skill On Time Admin Dashboard " />
                  <TableOne />
                </>
              }
            />
            <Route
              path="/total_counsellors"
              element={
                <>
                  <PageTitle title="Total Counsellors | Admin - Skill On Time Admin Dashboard " />
                  {/* <Total_counsellor /> */}
                  <CounselorList />

                </>
              }
            />
            <Route
              path="/total_courses"
              element={
                <>
                  <PageTitle title="Total Courses | Admin - Skill On Time Admin Dashboard " />
                  <Total_courses />
                </>
              }
            />
            <Route
              path="/forms/create-students"
              element={
                <>
                  <PageTitle title="Form Elements | Admin - Skill On Time Admin Dashboard " />
                  <FormElements />
                </>
              }
            />
            <Route
              path="/forms/form-counsellor"
              element={
                <>
                  <PageTitle title="Counsellor Form | Admin - Skill On Time Admin Dashboard " />
                  <CounsellorForm />
                </>
              }
            />
            <Route
              path="/tables"
              element={
                <>
                  <PageTitle title="Tables | Admin - Skill On Time Admin Dashboard " />
                  <Tables />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Settings | Admin - Skill On Time Admin Dashboard " />
                  <Settings />
                </>
              }
            />
            <Route
              path="/chart"
              element={
                <>
                  <PageTitle title="Chart | Admin - Skill On Time Admin Dashboard " />
                  <Chart />
                </>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <>
                  <PageTitle title="Alerts | Admin - Skill On Time Admin Dashboard " />
                  <Alerts />
                </>
              }
            />
            <Route
              path="/create_course"
              element={
                <>
                  <PageTitle title="Create Course | Admin - Skill On Time Admin Dashboard " />
                  <CreateCoursePage />
                </>
              }
            />
            <Route
              path="/create_topic"
              element={
                <>
                  <PageTitle title="Create Topic | Admin - Skill On Time Admin Dashboard " />
                  <CreateTopicPage />
                </>
              }
            />
             <Route
              path="/create_meeting"
              element={
                <>
                  <PageTitle title="Create Topic | Admin - Skill On Time Admin Dashboard " />
                  <Meeting />
                </>
              }
            />
            <Route
              path="/forms/form-create/batch"
              element={
                <>
                  <PageTitle title="Create Batch | Admin - Skill On Time Admin Dashboard " />
                  <CreateBatch />
                </>
              }
            />
            <Route
              path="/forms/form-manage/batch"
              element={
                <>
                  <PageTitle title="Manage Batches | Admin - Skill On Time Admin Dashboard " />
                  <ManageBatches />
                </>
              }
            />
            <Route
              path="/forms/form-manage/counsellor"
              element={
                <>
                  <PageTitle title="Counsellor List | Admin - Skill On Time Admin Dashboard " />
                  <CounselorList />
                </>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <>
                  <PageTitle title="Buttons | Admin - Skill On Time Admin Dashboard " />
                  <Buttons />
                </>
              }
            />
          </>
        ) : (
          <>
            <Route
              path="*"
              element={<Navigate to="/auth/signin" />}
            />
            <Route
              path="/auth/signin"
              element={
                <>
                  <PageTitle title="Signin | Admin - Skill On Time Admin Dashboard " />
                  <SignIn />
                </>
              }
            />
          </>
        )}
      </Routes>
    </LayoutWrapper>
      )
}
   </>
  )
}

export default App;
