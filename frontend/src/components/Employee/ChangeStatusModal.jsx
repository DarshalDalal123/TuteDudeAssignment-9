import { useState } from "react";
import { formatVisitTime } from "../../utils/time";
import ReactSelect from "react-select";
import axios from "axios";
import toast from "react-hot-toast"; 

export const ChangeStatusModal = ({
  appointmentId,
  visitorName,
  visitorEmail,
  visitDate,
  visitTime,
  currentStatus,
  onStatusChange
}) => {
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'scheduled', label: 'Schedule' },
    { value: 'cancelled', label: 'Cancel' },
  ];
  const [selectedStatus, setSelectedStatus] = useState(statusOptions.find(
    (option) => option.value === (currentStatus || '').toLowerCase()
  ) || null);

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStatus || selectedStatus.value === currentStatus) {
      toast.error("Please select a status");
      return;
    }

    await axios.put(`${import.meta.env.VITE_API_URL}/api/employee/visitor-request/${appointmentId}`, {
      status: selectedStatus.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then((response) => {
      if (response.data.success) {
        toast.success("Status updated successfully");
        document.getElementById('my_modal_1').close();
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        toast.error("Failed to update status");
      }
    }).catch((error) => {
      toast.error("An error occurred while updating status");
      console.error(error);
    });
  }

  return (
    <>
      <button className="bg-green-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer" onClick={() => document.getElementById('my_modal_1').showModal()}>Change Status</button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Visitor Name: {visitorName}</h3>
          <p className="py-4">Visitor Email: {visitorEmail}</p>
          <p className="py-4">Visit Date: {new Date(visitDate).toLocaleString().split(',')[0]}</p>
          <p className="py-4">Visit Time: {formatVisitTime(visitTime)}</p>
          <p className="py-4">Current Status: {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}</p>
          <div>
            <label className="block mb-2 font-bold">Change Status:</label>
            <ReactSelect
              options={statusOptions}
              value={selectedStatus}
              placeholder="Select new status"
              menuPosition="absolute"
              onChange={handleStatusChange}
            />
          </div>
          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-3">
              <button disabled={selectedStatus?.value === currentStatus || !selectedStatus} className="btn" onClick={handleSubmit}>
                Save
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}