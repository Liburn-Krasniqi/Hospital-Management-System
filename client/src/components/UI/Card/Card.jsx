import classes from "./Card.module.css";

export function Card({ children, className }) {
  return <div className={` ${className} ${classes.card}`}>{children}</div>;
}
