//import React, { useState } from "react";
//import type { Facility, approveFacility, rejectFacility } from "../../api/admin";
import React, { useState } from "react";


import type { Facility } from "../../api/admin";



import { approveFacility, rejectFacility } from "../../api/admin";


type Props = {
  facility: Facility | null;
  onClose: () => void;
  onAction: () => void; // refresh after action
};

export default function FacilityModal({ facility, onClose, onAction }: Props) {
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  if (!facility) return null;

  const handleApprove = async () => {
    setLoading(true);
    await approveFacility(facility._id, comments);
    setLoading(false);
    onAction();
    onClose();
  };

  const handleReject = async () => {
    setLoading(true);
    await rejectFacility(facility._id, comments);
    setLoading(false);
    onAction();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{facility.name}</h2>
        <p className="text-sm text-gray-500 mb-2">Owner: {facility.ownerName}</p>
        <p className="text-sm text-gray-500 mb-4">{facility.location}</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {facility.photos.map((p) => (
            <img key={p} src={p} alt="Facility" className="w-full h-24 object-cover rounded" />
          ))}
        </div>
        <textarea
          className="w-full border rounded p-2 text-sm mb-4"
          placeholder="Optional comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-1 border rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-1 bg-red-500 text-white rounded" disabled={loading} onClick={handleReject}>Reject</button>
          <button className="px-4 py-1 bg-green-500 text-white rounded" disabled={loading} onClick={handleApprove}>Approve</button>
        </div>
      </div>
    </div>
  );
}
