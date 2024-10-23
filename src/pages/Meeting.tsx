import React, { useState } from 'react';
import CreateMeeting from '../components/CreateMeeting';
import MeetingList from '../components/MeetingList';
import UpdateMeeting from '../components/UpdateMeeting';


const Meeting: React.FC = () => {
    const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Meeting Management</h1>
            <CreateMeeting />
            <MeetingList />
            {selectedMeetingId && <UpdateMeeting meetingId={selectedMeetingId} />}
        </div>
    );
};

export default Meeting;
