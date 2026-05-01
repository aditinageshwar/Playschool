import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/events.css";
import { FiCalendar, FiMapPin, FiEdit3, FiTrash2, FiPlus, FiStar } from "react-icons/fi";
import starsBg from "../../images/programs/bg.png"; 

const Events = () => {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({title: "", description: "", date: "", location: ""});
  const today = new Date().toISOString().split('T')[0];

  const fetchEvents = async () => {
    try {
      const res = await API.get("/api/events/all");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const editEvent = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location
    });
    setEditingId(event._id);
  };

  const deleteEvent = async (id) => {
    try {
      await API.delete(`/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/api/events/${editingId}`,form);
        setEditingId(null);
      } else {
        await API.post("/api/events/create", form);
      }
      setForm({ title: "", description: "", date: "", location: "" });
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      
      {/* --- 🔵 FORM CARD --- */}
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-50 sticky top-24">
          <h3 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FCEAE2] text-[#F07A4A] rounded-xl flex items-center justify-center">
              {editingId ? <FiEdit3 /> : <FiPlus />}
            </div>
            {editingId ? "Update Event" : "Create New Event"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Event Title (e.g. Annual Day)"
              className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <textarea
              placeholder="Short Description..."
              className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium h-24 resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="relative">
              <FiCalendar className="absolute left-4 top-4 text-[#3AA4AC]" />
              <input
                type="date"
                className="w-full p-4 pl-12 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                min={today}
              />
            </div>

            <div className="relative">
              <FiMapPin className="absolute left-4 top-4 text-[#F07A4A]" />
              <input
                type="text"
                placeholder="Location"
                className="w-full p-4 pl-12 bg-[#F8FAFC] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#3AA4AC] font-medium"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>

            <button className="w-full bg-[#F07A4A] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#d9693d] transition-all shadow-lg shadow-orange-100 active:scale-95 mt-2">
              {editingId ? "Save Changes" : "Post Event"}
            </button>
          </form>
        </div>
      </div>

      {/* --- 🟣 LIST CARD --- */}
      <div className="lg:col-span-2">
        <div className="bg-white/80 backdrop-blur-md rounded-[40px] shadow-xl border border-white/50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#1E3A5F] flex items-center gap-2">
              <FiStar className="text-[#3AA4AC]" /> Scheduled Activities
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#3AA4AC] uppercase text-[10px] font-bold tracking-[0.2em]">
                  <th className="p-6">Event Details</th>
                  <th className="p-6">Date & Venue</th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.length > 0 ? events.map((e) => (
                  <tr key={e._id} className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-6">
                      <p className="font-bold text-[#1E3A5F] text-lg">{e.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{e.description}</p>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#1E3A5F] flex items-center gap-1">
                          <FiCalendar size={14} /> {new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <FiMapPin size={12} /> {e.location}
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => editEvent(e)}
                          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Edit"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteEvent(e._id)}
                          className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="p-20 text-center text-slate-400 italic">
                      No magical events planned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Events;