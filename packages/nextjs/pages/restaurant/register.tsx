import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

export default function Register() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [restaurant, setRestaurant] = useState({} as any);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);
  const userWalletAddress = useGlobalState((state: any) => state.userWalletAddress);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "UserManagement",
    functionName: "registerRestaurant",
    args: [restaurant as any],
  });

  useEffect(() => {
    if (restaurant.id) {
      writeAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  const onRecieveRestaurantRegistered = (...args: unknown[]) => {
    setIsRegisterButtonLoading(false);
    console.log(args);
    notification.success(`Your restaurant ${name} is now registered`, {
      icon: "🥳",
    });
  };

  useScaffoldEventSubscriber({
    contractName: "UserManagement",
    eventName: "RestaurantRegistered",
    listener: onRecieveRestaurantRegistered,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "name": {
        setName(e.target.value);
        break;
      }
      case "phoneNumber": {
        setPhoneNumber(e.target.value);
        break;
      }
      case "location": {
        setLocation(e.target.value);
        break;
      }
      default:
    }
  };

  const onRegister = (e: any) => {
    setIsRegisterButtonLoading(true);
    e.preventDefault();
    const restaurant: any = {
      id: ethers.utils.formatBytes32String("1"),
      name,
      location,
      contact: phoneNumber,
      walletAddress: userWalletAddress,
      safetyRating: 0,
    };
    setRestaurant(restaurant);
    setName("");
    setPhoneNumber("");
    setLocation("");
  };

  return (
    <div className="h-screen md:flex">
      <div className="md:flex w-1/2 items-center justify-around bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
        <div>
          <h1 className="text-white text-4xl font-extrabold">Food Links</h1>
          <div className="divider text-white"></div>
          <p className="text-white">
            As a restaurant you can now offer your food on top of a transparent system, leading to customer trust and
            more sales.
          </p>
        </div>
      </div>
      <div className="flex md:w-1/2 flex-wrap justify-around items-center">
        <div className="w-1/2">
          <h1 className="text-2xl font-semibold">Restaurant Registration</h1>
          <div className="divider"></div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">What is the restaurant name?</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full input-sm"
              value={name}
              onChange={onChange}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">What is your business phone number?</span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Type your contact number here"
              value={phoneNumber}
              onChange={onChange}
              className="input input-bordered w-full input-sm"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Where is your business located?</span>
            </label>
            <input
              type="text"
              name="location"
              placeholder="Type location here"
              value={location}
              onChange={onChange}
              className="input input-bordered w-full input-sm"
            />
          </div>
          <div className="flex justify-end my-4">
            <button
              className={`btn btn-sm btn-primary mt-2 ${isRegisterButtonLoading ? "loading" : ""}`}
              onClick={onRegister}
            >
              {isRegisterButtonLoading ? "Registering ..." : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
