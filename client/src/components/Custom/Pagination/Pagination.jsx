import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import classes from "./Pagination.module.css";

/*
# Pagination Custom Component overview

Displays a list of page numbers and two buttons (next and previous) which upon clicking
display the respective entities of the selected page.

The Pagination component only manages the selected page, the logic for choosing how 
many entities a page contains (and how many should be skipped) should be implemented 
on the parent component.

--- 

# Spec

Takes in arguments: 
 - currentPage ~ (number) This should come from the state of the parent component as something like:
    const [currentPage, setPage] = useState(0);

 - jumpToPage() ~ (function) This function defines the logic for changing up the 'skip' and 'take'
   agruments that get sent to the backend:
      function jumpToPage(page) {
        setSkip(take * page);
        setPage(page);
      }
    this also needs:
      const [skip, setSkip] = useState(0);
    
 - pageNumbers ~ (numeric []) Array of pages (0 indexed) to be displayed in respect to number of entites with 'take' and 'skip' values in mind
  in the parent component set up this:
    const [pages, setPages] = useState(0);
    ...
    // When fetching data from the backend 
    setPages(Math.ceil(total_number_of_entities / take)); // Set the number of pages based on the number of entities and how many we display per page
    ...
    const pageNumbers = [];
    for (let i = 0; i < pages; i++) {
    pageNumbers.push(i);
    }
*/

export function Pagination({ currentPage, jumpToPage, pageNumbers }) {
  if (pageNumbers.length > 0) {
    return (
      <div className="d-flex justify-content-center mt-5 ">
        <ul className="list-group list-group-horizontal shadow-lg">
          <button
            onClick={() => jumpToPage(currentPage - 1)}
            className="background-1 border-0 rounded-start"
          >
            <ArrowBigLeft fill="#67c090" className="color-3"></ArrowBigLeft>
          </button>

          {pageNumbers.map((number) => {
            return (
              <li
                className={`list-group-item  border-0 ${
                  classes.pagination_li
                } ${number === currentPage ? "background-2" : "background-3"}`}
                key={number}
                id={number}
                onClick={() => jumpToPage(number)}
              >
                {number + 1}
              </li>
            );
          })}

          <button
            onClick={() => jumpToPage(currentPage + 1)}
            className="background-1 border-0 rounded-end"
          >
            <ArrowBigRight fill="#67c090" className="color-3"></ArrowBigRight>
          </button>
        </ul>
      </div>
    );
  } else {
    return <></>;
  }
}
