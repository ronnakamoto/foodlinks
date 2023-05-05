import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import Card from "~~/components/Card";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const PurchaseProducts: NextPage = () => {
  const [supplies, setSupplies] = useState<any[]>([]);
  const [productToPurchase, setProductToPurchase] = useState<any>({
    id: null,
    amount: 0,
  });
  const [isBuyButtonLoading, setIsBuyButtonLoading] = useState(false);

  useEffect(() => {
    const fetchSupplies = async () => {
      const response = await fetch("/api/supplies");
      const supplies = await response.json();
      setSupplies(supplies);
    };
    fetchSupplies();
  }, []);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "Traceability",
    functionName: "buyProductBatch",
    args: [productToPurchase?.id, productToPurchase?.amount],
  });

  useEffect(() => {
    if (productToPurchase.id) {
      writeAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToPurchase]);

  const updatePurchaseToOffchainDb = async (id: string) => {
    const quantity = supplies?.find((supply: any) => supply.id === id)?.quantity - 1;
    const response = await fetch("/api/supplies", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        quantity,
      }),
    });
    const supplies = await response.json();
    setSupplies(supplies);
  };

  const onRecieveProductBatchTransferred = (...args: unknown[]) => {
    setIsBuyButtonLoading(false);
    console.log(args);
    notification.success(`Your order was successful`, {
      icon: "🥳",
    });
    updatePurchaseToOffchainDb(productToPurchase.id);
  };

  useScaffoldEventSubscriber({
    contractName: "Traceability",
    eventName: "ProductBatchTransferred",
    listener: onRecieveProductBatchTransferred,
  });

  const onBuyNowClicked = (id: string) => {
    setIsBuyButtonLoading(true);
    console.log("Buy now clicked", id);
    setProductToPurchase({ id, amount: 1 });
  };

  return (
    <>
      <Head>
        <title>FoodLinks | Restaurant Purchase Products</title>
        <meta name="description" content="Re-inventing transparency in food industry" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <div className="flex grow">
        <div className="m-4 p-4 flex-1 ml-0">
          <h1 className="text-2xl font-extrabold ml-2">Available Food Supplies For Purchase</h1>
          <div className="mt-4">
            <div className="flex justify-start flex-wrap grow">
              {supplies?.map(product => (
                <div key={product.id} className="m-4">
                  <Card
                    id={product.id}
                    title={product.name}
                    description={`Available Quantity: ${product.quantity}`}
                    price={`₹${product.price}`}
                    onBuyNowClicked={() => onBuyNowClicked(product.foodProductId)}
                    isBuyButtonLoading={isBuyButtonLoading}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PurchaseProducts;
