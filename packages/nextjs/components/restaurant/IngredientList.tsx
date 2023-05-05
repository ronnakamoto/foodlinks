import { useState } from "react";

export default function IngredientList({ data }: any) {
  const [requiredQuantity, setRequiredQuantity] = useState(0);
  const onChangeRequiredQuantity = (e: any) => {
    setRequiredQuantity(e.target.value);
  };
  return (
    <div className="flex flex-col max-h-96 overflow-y-auto">
      {data?.map((item: any, index: number) => (
        <div key={index} className="card card-compact bg-base-100 border">
          <div className="card-body space-y-2">
            <h2 className="card-title">{item.name}</h2>
            <p>
              <span>Available Quantity: </span>
              <span>{item.availableQuantity}</span>
            </p>
            <p className="flex justify-between align-middle">
              <span className="basis-1/2">Required Quantity: </span>
              <span>
                <input
                  type="number"
                  className="input input-bordered input-sm w-1/2"
                  value={requiredQuantity}
                  onChange={onChangeRequiredQuantity}
                />
              </span>
            </p>
            {/* <div className="card-actions justify-end">
              <button className="btn btn-primary btn-sm">Add Ingredient</button>
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
}
