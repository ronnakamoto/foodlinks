/**
 * 1. Consumer chooses the restaurant from the dropdown list
 * 2. Consumer chooses the dish from the dropdown list which was purchased for the restaurant
 * 3. Consumer writes the complaint message/comments
 * 4. Consumer requests the compensation amount
 * 5. Consumer submits the complaint
 */
import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import SidePanel from "~~/components/SidePanel";
import Table from "~~/components/Table";
import AddNewComplaint from "~~/components/consumer/AddNewComplaint";

const ConsumerComplaint: NextPage = () => {
  const sidePanelTitle = "Add New Complaint";
  const [complaints, setComplaints] = useState<any[]>([]);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const onViewRowDetailsClicked = (row: any) => {
    console.log("View row details clicked", row);
    setShowSidePanel(true);
  };

  const onRemoveSupplyClicked = (row: any) => {
    console.log("Remove supply clicked", row);
  };

  const onSidepanelClosed = () => {
    setShowSidePanel(false);
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      const complaints = [
        {
          name: "Complaint 1",
          id: "1",
          restauarnId: "abc1",
          restuarantName: "ABC Restuarant",
          comments: "lorem ipsum",
          compensationRequested: "2500",
        },
        {
          name: "Complaint 2",
          id: "2",
          restauarnId: "abc2",
          restuarantName: "XYZ Restuarant",
          comments: "lorem ipsum",
          compensationRequested: "4000",
        },
      ];
      //   const response = await fetch("/api/supplies");
      //   const supplies = await response.json();
      setComplaints(complaints);
    };
    fetchComplaints();
  }, []);

  const onAddNewComplaint = () => {
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
        <AddNewComplaint />
      </SidePanel>
      <div className="flex flex-grow">
        <div className="m-4 p-4 flex-1">
          <h1 className="text-2xl font-extrabold">Consumer Complaints Management</h1>
          <div className="flex justify-end my-4">
            <button className="btn btn-sm btn-primary" onClick={onAddNewComplaint}>
              Add New Complaint
            </button>
          </div>
          <Table
            data={complaints}
            columns={[
              {
                key: "name",
                title: "Complaint Name",
                isSortable: true,
                isSearchable: true,
              },
              {
                key: "restuarantName",
                title: "Restuarant Name",
                isSortable: true,
                isSearchable: true,
              },
              {
                key: "compensationRequested",
                title: "Compensation Requested",
                isSortable: false,
                isSearchable: true,
              },
            ]}
            onViewRowDetailsClicked={onViewRowDetailsClicked}
            onRemoveSupplyClicked={onRemoveSupplyClicked}
          />
        </div>
      </div>
    </>
  );
};

export default ConsumerComplaint;
