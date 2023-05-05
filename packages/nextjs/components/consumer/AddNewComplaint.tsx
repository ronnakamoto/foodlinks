import { useEffect, useState } from "react";

export default function AddNewComplaint() {
  const [restuarants, setRestaurants] = useState<any[]>([]);
  const [comments, setComments] = useState("");
  const [compensationRequested, setCompensationRequested] = useState("");
  const [restauarntId, setRestauarntId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const onSubmitComplaintClicked = () => {
    console.log(restauarntId, comments, compensationRequested);
    setIsSaving(true);
  };

  const onChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "restauarntId") {
      setRestauarntId(value);
    } else if (name === "comments") {
      setComments(value);
    } else if (name === "compensationRequested") {
      setCompensationRequested(value);
    }
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      const restauarants = [
        {
          name: "KFC",
          id: "1",
        },
        {
          name: "McDonalds",
          id: "2",
        },
      ];
      //   const response = await fetch("/api/restaurants");
      //   const data = await response.json();
      setRestaurants(restauarants);
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Choose the restaurant</span>
        </label>
        <select
          name="restauarntId"
          className="select select-sm select-bordered"
          value={restauarntId}
          onChange={onChange}
        >
          <option disabled selected>
            Pick one
          </option>
          {restuarants.map((restaurant, index) => (
            <option key={index} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Comments</span>
        </label>
        <textarea
          name="comments"
          value={comments}
          placeholder="Description of the issue"
          className="textarea textarea-bordered textarea-xs w-full max-w-xs"
          onChange={onChange}
        ></textarea>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Compensation amount(Rs) you would like to request?</span>
        </label>
        <input
          name="compensationRequested"
          type="number"
          placeholder="Type expected compensation amount here"
          className="input input-bordered input-sm w-full max-w-xs"
          value={compensationRequested}
          onChange={onChange}
        />
      </div>
      <div className="flex mt-4 justify-end">
        <button className={`btn btn-sm btn-primary ${isSaving ? "loading" : ""}`} onClick={onSubmitComplaintClicked}>
          Submit Complaint
        </button>
      </div>
    </div>
  );
}
