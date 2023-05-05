import { useState } from "react";
import IngredientList from "./IngredientList";

export default function CreateNewDish() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const onChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "price") {
      setPrice(value);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the name of the dish?</span>
        </label>
        <input
          name="name"
          type="text"
          placeholder="Type dish name here"
          className="input input-bordered input-sm w-full max-w-xs"
          value={name}
          onChange={onChange}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the price of the dish?</span>
        </label>
        <input
          name="price"
          type="number"
          placeholder="Type dish price here"
          className="input input-bordered input-sm w-full max-w-xs"
          value={price}
          onChange={onChange}
        />
      </div>
      <h2 className="text-xl font-extralight mt-4 mb-2">Add Ingredients</h2>
      <IngredientList
        data={[
          {
            name: "Supply 1",
            availableQuantity: 3,
          },
        ]}
      />
      <div className="flex justify-end my-4">
        <button className="btn btn-sm btn-primary">Create Dish</button>
      </div>
    </div>
  );
}
