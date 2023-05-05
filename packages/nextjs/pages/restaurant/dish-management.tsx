import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import SidePanel from "~~/components/SidePanel";
import Table from "~~/components/Table";
import CreateNewDish from "~~/components/restaurant/CreateNewDish";

const DishManagement: NextPage = () => {
  const sidePanelTitle = "Add New Dish";
  const [supplies, setSupplies] = useState<any[]>([]);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const onViewRowDetailsClicked = (row: any) => {
    console.log("View row details clicked", row);
    setShowSidePanel(true);
  };

  const onRemoveDishClicked = (row: any) => {
    console.log("Remove Dish clicked", row);
  };

  const onSidepanelClosed = () => {
    setShowSidePanel(false);
  };

  useEffect(() => {
    const fetchSupplies = async () => {
      const supplies = [
        {
          name: "Dish 1",
          id: "1",
          fromLocation: "Kollam, Kerala",
        },
        {
          name: "Dish 2",
          id: "2",
          fromLocation: "Kochi, Kerala",
        },
      ];
      //   const response = await fetch("/api/supplies");
      //   const supplies = await response.json();
      setSupplies(supplies);
    };
    fetchSupplies();
  }, []);

  const onAddNewDish = () => {
    console.log("Add new Dish clicked");
    setShowSidePanel(true);
  };

  return (
    <>
      <Head>
        <title>FoodLinks</title>
        <meta name="description" content="Re-inventing transparency in food industry" />
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </Head>
      <SidePanel
        title={sidePanelTitle}
        position="right"
        isOpen={showSidePanel}
        widthClasses={`w-1/4 bg-zinc-100 border-l border-zinc-200 shadow`}
        onClose={onSidepanelClosed}
      >
        <CreateNewDish />
      </SidePanel>
      <div className="flex flex-grow">
        <div className="m-4 p-4 flex-1">
          <h1 className="text-2xl font-extrabold">Restuarant Dish Management</h1>
          <div className="flex justify-end my-4">
            <button className="btn btn-sm btn-primary" onClick={onAddNewDish}>
              Add New Dish
            </button>
          </div>
          <Table
            data={supplies}
            columns={[
              {
                key: "name",
                title: "Supply Name",
                isSortable: true,
                isSearchable: true,
              },
              {
                key: "fromLocation",
                title: "Origin Location",
                isSortable: true,
                isSearchable: true,
              },
            ]}
            onViewRowDetailsClicked={onViewRowDetailsClicked}
            onRemoveSupplyClicked={onRemoveDishClicked}
          />
        </div>
      </div>
    </>
  );
};

export default DishManagement;
