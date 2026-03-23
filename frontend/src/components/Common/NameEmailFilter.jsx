import { useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const NameEmailFilter = ({ getFilterValues = () => { } }) => {
  const [filters, setFilters] = useState({ name: '', email: '', fromDate: null, toDate: null });
  const modalRef = useRef(null);

  const onChange = (field) => (event) => {
    setFilters((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const applyFilter = () => {
    getFilterValues({
      name: filters.name.trim(),
      email: filters.email.trim(),
      fromDate: filters.fromDate,
      toDate: filters.toDate
    })
    modalRef.current?.close()
  }

  const clearFilter = () => {
    const emptyFilters = { name: '', email: '', fromDate: null, toDate: null };
    setFilters(emptyFilters);
    getFilterValues(emptyFilters);
    modalRef.current?.close();
  }

  return (
    <>
      <button
        className="inline-flex items-center rounded-xl bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 cursor-pointer"
        onClick={() => modalRef.current?.showModal()}
      >
        Filter
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <div className="mb-4">
            <label className="block mb-2 font-bold">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Filter by Name"
              value={filters.name}
              onChange={onChange('name')}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-bold">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Filter by Email"
              value={filters.email}
              onChange={onChange('email')}
            />
          </div>
          <div className='mb-4'>
            <label className='block font-bold mb-2'>From Date</label>
            <DatePicker
              className='w-full px-3 py-2 border rounded-md'
              placeholderText='Select Date'
              selected={filters.fromDate}
              onChange={(date) => setFilters({ ...filters, fromDate: date })}
              dateFormat='yyyy-MM-dd'
            />
          </div>
          <div className='mb-4'>
            <label className='block font-bold mb-2'>To Date</label>
            <DatePicker
              className='w-full px-3 py-2 border rounded-md'
              placeholderText='Select Date'
              selected={filters.toDate}
              onChange={(date) => setFilters({ ...filters, toDate: date })}
              dateFormat='yyyy-MM-dd'
              excludeDateIntervals={filters.fromDate ? [{ start: new Date(0), end: filters.fromDate }] : []}
            />
          </div>
          <div className="modal-action gap-2">
            <button
              className="btn btn-primary"
              onClick={applyFilter}
              disabled={Boolean(filters.fromDate && !filters.toDate)}
            >
              Apply
            </button>
            <button className="btn" onClick={clearFilter}>Clear</button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
