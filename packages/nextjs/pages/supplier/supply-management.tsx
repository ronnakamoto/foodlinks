import { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import SidePanel from "~~/components/SidePanel";
import Table from "~~/components/Table";
import TxHashLink from "~~/components/TxHashLink";
import { Address } from "~~/components/scaffold-eth";
import AddNewFoodSupply from "~~/components/supplier/AddNewFoodSupply";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

const SupplyManagement: NextPage = () => {
  const sidePanelTitle = "Add New Food Supply";
  const [supplies, setSupplies] = useState<any[]>([]);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showApproveFoodLinks, setShowApproveFoodLinks] = useState(true);
  const userWalletAddress = useGlobalState(state => state.userWalletAddress);

  const { data: TraceabilityContract } = useScaffoldContract({ contractName: "Traceability" });
  console.log("🚀 ~ file: supply-management.tsx:18 ~ TraceabilityContract:", TraceabilityContract);

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "Traceability",
    functionName: "approveContractForTransfers",
  });

  const { data: isFoodlinksApproved } = useScaffoldContractRead({
    contractName: "Traceability",
    functionName: "isApprovedForAll",
    args: [userWalletAddress, TraceabilityContract?.address],
  });

  useEffect(() => {
    if (isFoodlinksApproved) {
      setShowApproveFoodLinks(false);
    }
  }, [isFoodlinksApproved]);

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
    const fetchSupplies = async () => {
      //   const supplies = [
      //     {
      //       name: "Food Supply 1",
      //       createdBy: "0xA565b30bE466e71984d15c46cBe479bcce907E17",
      //       txHash: "0x080c3e33bb53a42057c612d227d87b8263f051ffe88d074e6b59b82a810a4c96",
      //     },
      //     {
      //       name: "Food Supply 2",
      //       createdBy: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      //       txHash: "0x080c3e33bb53a42057c612d227d87b8263f051ffe88d074e6b59b82a810a4c96",
      //     },
      //   ];
      const response = await fetch("/api/supplies");
      const supplies = await response.json();
      setSupplies(supplies || []);
    };
    fetchSupplies();
  }, []);

  const onAddNewFoodSupply = () => {
    console.log("Add new food supply clicked");
    setShowSidePanel(true);
  };

  const onFoodSupplyAdded = (foodSupply: any) => {
    console.log("Food supply added", foodSupply);
    setSupplies([...supplies, foodSupply]);
    setShowSidePanel(false);
    notification.success(`Food supply ${foodSupply.name} has been added`, {
      icon: "🥳",
    });
  };

  const onApproveFoodLinksClicked = () => {
    console.log("Approve food links clicked");
    writeAsync();
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
        <AddNewFoodSupply onFoodSupplyAdded={onFoodSupplyAdded} />
      </SidePanel>
      <div className="flex flex-grow">
        <div className="m-4 p-4 flex-1">
          <h1 className="text-2xl font-extrabold">Food Supplies Management</h1>
          {showApproveFoodLinks && (
            <div className="flex justify-center align-middle">
              <span className="translate-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </span>

              <a className="link link-neutral m-4" onClick={onApproveFoodLinksClicked}>
                Click Here To Approve FoodLinks Platform To Perform On-Chain Food Supply Token Transfers
              </a>
            </div>
          )}
          <div className="flex justify-end my-4">
            <button className="btn btn-sm btn-primary" onClick={onAddNewFoodSupply}>
              Add New Food Supply
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
                key: "price",
                title: "Price",
                isSortable: true,
                isSearchable: true,
              },
              {
                key: "quantity",
                title: "Quantity",
                isSortable: true,
                isSearchable: true,
              },
              {
                key: "createdBy",
                title: "Created By",
                isSortable: true,
                isSearchable: true,
                render(row) {
                  return <Address address={row.createdBy} />;
                },
              },
              {
                key: "txHash",
                title: "Transaction Hash",
                isSortable: false,
                isSearchable: true,
                render(row) {
                  return <TxHashLink txHash={row.txHash} />;
                },
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

export default SupplyManagement;
