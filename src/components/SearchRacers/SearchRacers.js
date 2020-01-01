import React from "react";
import { Input } from "antd";

const { Search } = Input;

export default function SearchRacers({ setFilteredRacers, racers, className }) {
  const handleOnSearch = value => {
    let searchedReacers = racers.filter(racer => {
      const name = racer.Name.toLowerCase();
      const searchValue = value.toLowerCase();
      if (name.includes(searchValue)) {
        return true;
      }
      return false;
    });
    setFilteredRacers(searchedReacers);
  };

  return (
    <Search
      placeholder="Search name"
      onChange={e => handleOnSearch(e.target.value)}
      className={className}
    />
  );
}
