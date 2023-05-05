import { useEffect, useState } from "react";
import DatetimePicker from "../DateTimePicker";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { Web3Storage } from "web3.storage";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN ?? "" });
const dateTomorrow = new Date();
dateTomorrow.setDate(dateTomorrow.getDate() + 1);

export default function AddNewFoodSupply({ onFoodSupplyAdded }: any) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [temperature, setTemperature] = useState("");
  const [product, setProduct] = useState({} as any);
  const [metadataURI, setMetadataURI] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "Traceability",
    functionName: "createProductBatch",
    args: [product as any, metadataURI as string],
  });

  useEffect(() => {
    if (product.id) {
      writeAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const storeDataInIpfs = async () => {
    const blob = new Blob([JSON.stringify(product)], { type: "application/json" });
    const cid = await client.put([new File([blob], "product.json", { type: "application/json" })]);
    return cid;
  };

  const onAddProductClicked = async () => {
    setIsSaving(true);
    console.log("Add product clicked");
    const uuidString = uuidv4();
    const hexStringWithoutDashes = uuidString.replace(/-/g, "");
    const fixedLengthUUID = hexStringWithoutDashes.substring(0, 31);
    const product: any = {
      id: ethers.utils.formatBytes32String(fixedLengthUUID),
      amount: quantity,
      producerId: ethers.utils.formatBytes32String("1"),
      productionDate: Math.floor(new Date().getTime() / 1000),
      expirationDate: Math.floor(new Date().getTime() / 1000),
      location: fromLocation,
    };
    setProduct(product);
    const cid = await storeDataInIpfs();
    console.log("🚀 ~ file: AddNewFoodSupply.tsx:48 ~ onAddProductClicked ~ cid:", cid);
    setMetadataURI(`ipfs://${cid}`);
  };

  const saveProductOffchain = async (txHash: string, createdBy: string) => {
    const response = await fetch("/api/supplies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foodProductId: product.id,
        supplierId: product.producerId,
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        expiryDate: new Date(product.expirationDate * 1000),
        txHash,
        createdBy,
      }),
    });

    if (!response.ok) {
      throw new Error("Error registering consumer");
    }

    const responseData = await response.json();
    console.log("🚀 ~ file: AddNewFoodSupply.tsx:66 ~ saveProductOffchain ~ responseData", responseData);
    setIsSaving(false);
    // reset states
    setName("");
    setPrice("");
    setQuantity("");
    setFromLocation("");
    setTemperature("");
    setProduct({} as any);
    setMetadataURI("");
    onFoodSupplyAdded && onFoodSupplyAdded(responseData);
  };

  const onRecieveProductBatchCreated = (...args: unknown[]) => {
    console.log(args);
    const createdBy = args[args.length - 2] as string;
    const txHash = (args[args.length - 1] as any)?.transactionHash;
    if (txHash) {
      saveProductOffchain(txHash, createdBy);
    }
  };

  useScaffoldEventSubscriber({
    contractName: "Traceability",
    eventName: "ProductBatchCreated",
    listener: onRecieveProductBatchCreated,
  });

  const onChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "price") {
      setPrice(value);
    } else if (name === "fromLocation") {
      setFromLocation(value);
    } else if (name === "temperature") {
      setTemperature(value);
    } else if (name === "quantity") {
      setQuantity(value);
    }
  };

  const onChangeExpiryDate = (date: Date) => {
    const productUpdated: any = {
      ...product,
      expirationDate: Math.floor(date.getTime() / 1000),
    };
    setProduct(productUpdated);
  };

  return (
    <div className="flex flex-col">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the product name?</span>
        </label>
        <input
          name="name"
          type="text"
          placeholder="Type product name here"
          className="input input-bordered input-sm w-full max-w-xs"
          value={name}
          onChange={onChange}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the price of the product?</span>
        </label>
        <input
          name="price"
          type="number"
          placeholder="Type product price here"
          className="input input-bordered input-sm w-full max-w-xs"
          value={price}
          onChange={onChange}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Where is the place of origin of the product?</span>
        </label>
        <input
          name="fromLocation"
          type="text"
          placeholder="Type product's origin location here"
          className="input input-bordered input-sm w-full max-w-xs"
          value={fromLocation}
          onChange={onChange}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">At what temperature(degrees) is the product stored?</span>
        </label>
        <input
          name="temperature"
          type="number"
          placeholder="Type product's storage temperature here"
          className="input input-bordered input-sm w-full max-w-xs"
          value={temperature}
          onChange={onChange}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What quantity is available?</span>
        </label>
        <input
          name="quantity"
          type="number"
          placeholder="Type product's available quantity here"
          className="input input-bordered input-sm w-full max-w-xs"
          value={quantity}
          onChange={onChange}
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">What is the expiry date?</span>
        </label>
        <DatetimePicker value={dateTomorrow} onChange={onChangeExpiryDate} />
      </div>
      <div className="flex mt-4 justify-end">
        <button className={`btn btn-sm btn-primary ${isSaving ? "loading" : ""}`} onClick={onAddProductClicked}>
          Add The Product
        </button>
      </div>
    </div>
  );
}
