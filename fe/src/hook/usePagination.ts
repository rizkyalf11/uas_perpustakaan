import { ChangeEvent, useState } from "react";

interface PaginationParams {
  page: number;
  pageSize: number;
}

export const usePagination = <T extends PaginationParams>(defaultParams: T) => {
  let [params, setParams] = useState<T>(defaultParams);
  let [filterParams, setFilterParams] = useState<T>(defaultParams);

  const handleFilter = () => {
    setFilterParams({ ...params, page: 1 });
    setParams((prevParams) => {
      return {
        ...prevParams,
        page: 1
      }
    })
  };

  const handleClear = () => {
    setFilterParams(defaultParams);
    setParams(defaultParams);
  };

  const handlePageSize = (e: ChangeEvent<any>) => {
    setParams((params) => ({ ...params, pageSize: e.target.value, page: 1 }));
    setFilterParams((params) => ({ ...params, pageSize: e.target.value, page: 1 }));
  };

  const handlePage = (page: number) => {
    setParams((params) => ({ ...params, page: page }));
    setFilterParams((params) => ({ ...params, page: page }));
  };

  return {
    params,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    setFilterParams
  };
};
