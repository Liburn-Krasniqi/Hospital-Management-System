import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import classes from "./Pagination.module.css";

export function Pagination({ currentPage, jumpToPage, pageNumbers }) {
  return (
    <div className="d-flex justify-content-center mt-5">
      <ul className="list-group list-group-horizontal">
        <button onClick={() => jumpToPage(currentPage - 1)}>
          <ArrowBigLeft></ArrowBigLeft>
        </button>
        {pageNumbers.map((number) => {
          return (
            <li
              className={`list-group-item ${classes.pagination_li} ${
                number === currentPage ? classes.curr : ""
              }`}
              key={number}
              id={number}
              onClick={() => jumpToPage(number)}
            >
              {number + 1}
            </li>
          );
        })}
        <button onClick={() => jumpToPage(currentPage + 1)} className="">
          <ArrowBigRight></ArrowBigRight>
        </button>
      </ul>
    </div>
  );
}
