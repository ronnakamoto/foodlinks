import { useEffect, useState } from "react";

const useTableSearch = (data: any, columns: any, search: any) => {
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    let filteredItems = data;
    columns.forEach((column: any) => {
      if (column.isSearchable && search[column.key]) {
        filteredItems = filteredItems.filter((item: any) =>
          item[column.key].toString().toLowerCase().includes(search[column.key].toLowerCase()),
        );
      }
    });
    setFilteredData(filteredItems);
  }, [data, columns, search]);

  return filteredData;
};

export default useTableSearch;
