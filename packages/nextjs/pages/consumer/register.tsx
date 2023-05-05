import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

export default function Register() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [consumer, setConsumer] = useState({} as any);
  const [isRegisterButtonLoading, setIsRegisterButtonLoading] = useState(false);
  const userWalletAddress = useGlobalState((state: any) => state.userWalletAddress);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "UserManagement",
    functionName: "registerConsumer",
    args: [consumer as any],
  });

  useEffect(() => {
    if (consumer.id) {
      writeAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consumer]);

  const onRecieveConsumerRegistered = (...args: unknown[]) => {
    setIsRegisterButtonLoading(false);
    console.log(args);
  };

  useScaffoldEventSubscriber({
    contractName: "UserManagement",
    eventName: "ConsumerRegistered",
    listener: onRecieveConsumerRegistered,
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
      default:
    }
  };

  const onRegister = (e: any) => {
    setIsRegisterButtonLoading(true);
    e.preventDefault();
    console.log(name, phoneNumber);
    const consumer: any = {
      id: ethers.utils.formatBytes32String("1"),
      walletAddress: userWalletAddress,
      name,
    };
    console.log("🚀 ~ file: register.tsx:17 ~ Register ~ consumer:", consumer);
    setConsumer(consumer);
    setName("");
    setPhoneNumber("");
  };

  return (
    <div className="h-screen md:flex">
      <div className="md:flex w-1/2 items-center justify-around bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
        <div>
          <h1 className="text-white text-4xl font-extrabold">Food Links</h1>
          <div className="divider text-white"></div>
          <p className="text-white">
            As a consumer you can now have a better way to understand the food you purchase, backed by an insurance
            layer
          </p>
        </div>
      </div>
      <div className="flex md:w-1/2 flex-wrap justify-around items-center">
        <div className="w-1/2">
          <h1 className="text-2xl font-semibold">Consumer Registration</h1>
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
              placeholder="Type here"
              value={phoneNumber}
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
