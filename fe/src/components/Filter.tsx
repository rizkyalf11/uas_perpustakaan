import { BookListFilter } from "@/app/(staff)/pustakawan/interface";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";

type FilterProps = {
  params: BookListFilter;
  setParams: Dispatch<SetStateAction<any>>;
};

export default function Filter({ params, setParams }: FilterProps) {
  const handleChange = (e: ChangeEvent<any>) => {
    setParams((params: BookListFilter) => {
      return {
        ...params,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <section>
      <label className="form-control w-full" htmlFor="judul">
        <div className="label">
          <span className="label-text">Judul</span>
        </div>
        <input
          id="judul"
          type="text"
          placeholder="Novel Laut Bercerita"
          className="input input-bordered w-full"
          name="judul"
          value={params.judul}
          onChange={handleChange}
        />
      </label>
      <label className="form-control w-full" htmlFor="pengarang">
        <div className="label">
          <span className="label-text">Pengarang</span>
        </div>
        <input
          id="pengarang"
          type="text"
          placeholder="Ariiq"
          className="input input-bordered w-full"
          name="pengarang"
          value={params.pengarang}
          onChange={handleChange}
        />
      </label>
      <label className="form-control w-full" htmlFor="from_year">
        <div className="label">
          <span className="label-text">Dari Tahun</span>
        </div>
        <input
          id="from_year"
          type="text"
          placeholder="2012"
          className="input input-bordered w-full"
          name="dari_tahun_terbit"
          value={params.dari_tahun_terbit}
          onChange={handleChange}
        />
      </label>
      <label className="form-control w-full" htmlFor="to_year">
        <div className="label">
          <span className="label-text">Sampai Tahun</span>
        </div>
        <input
          id="to_year"
          type="text"
          placeholder="2024"
          className="input input-bordered w-full"
          name="sampai_tahun_terbit"
          value={params.sampai_tahun_terbit}
          onChange={handleChange}
        />
      </label>
    </section>
  );
}
