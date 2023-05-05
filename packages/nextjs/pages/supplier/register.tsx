import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

export default function Register() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [supplier, setSupplier] = useState({} as any);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);
  const userWalletAddress = useGlobalState((state: any) => state.userWalletAddress);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "UserManagement",
    functionName: "registerSupplier",
    args: [supplier as any],
  });

  useEffect(() => {
    if (supplier.id) {
      writeAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  const onRecieveSupplierRegistered = (...args: unknown[]) => {
    setIsRegisterButtonLoading(false);
    console.log(args);
  };

  useScaffoldEventSubscriber({
    contractName: "UserManagement",
    eventName: "SupplierRegistered",
    listener: onRecieveSupplierRegistered,
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
    const supplier: any = {
      id: ethers.utils.formatBytes32String("1"),
      name,
      location,
      contact: phoneNumber,
      walletAddress: userWalletAddress,
    };
    console.log("🚀 ~ file: register.tsx:17 ~ Register ~ supplier:", supplier);
    setSupplier(supplier);
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
            As a supplier you can now be sure that the food you supply is reaching the consumers in a safe and secure
            way.
          </p>
        </div>
      </div>
      <div className="flex md:w-1/2 flex-wrap justify-around items-center">
        <div className="w-1/2">
          <h1 className="text-2xl font-semibold">Supplier Registration</h1>
          <div className="divider"></div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">What is your name?</span>
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
              <span className="label-text">What is your phone number?</span>
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
              <span className="label-text">Where are you located?</span>
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
