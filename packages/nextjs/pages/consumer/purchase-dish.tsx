import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import Card from "~~/components/Card";

const PurchaseDish: NextPage = () => {
  const [dishes, setDishes] = useState<any[]>([]);

  useEffect(() => {
    const fetchDishes = async () => {
      const dishes = [
        {
          name: "Chicken Biriyani",
          id: "1",
          temperature: "10",
          price: "230",
          expiryDate: "12/12/2021",
        },
        {
          name: "Chilly Chicken",
          id: "2",
          temperature: "20",
          price: "280",
          expiryDate: "12/12/2021",
        },
      ];
      //   const response = await fetch("/api/supplies");
      //   const supplies = await response.json();
      setDishes(dishes);
    };
    fetchDishes();
  }, []);

  const onBuyNowClicked = (id: string) => {
    console.log("Buy now clicked", id);
  };

  return (
    <>
      <Head>
        <title>FoodLinks | Consumer Purchase Dish</title>
        <meta name="description" content="Re-inventing transparency in food industry" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <div className="flex flex-grow">
        <div className="m-4 p-4 flex-1">
          <h1 className="text-2xl font-extrabold">Available Dishes For Purchase</h1>
          <div className="mt-4">
            <div className="flex justify-start">
              {dishes?.map((dish: any) => (
                <div key={dish.id} className="m-4 ml-0">
                  <Card
                    id={dish.id}
                    title={dish.name}
                    description={`Consume by ${dish.expiryDate}`}
                    price={dish.price}
                    onBuyNowClicked={onBuyNowClicked}
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

export default PurchaseDish;
