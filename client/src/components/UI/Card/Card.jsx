import classes from "./Card.module.css";

export function Card({ children, className }) {
  return (
    <div className={` ${className} ${classes.card} overflow-auto`}>
      {children}
    </div>
  );
}
