import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

const formatSpots = function (numSpots) {
  if(numSpots === 0) {
    return 'no spots remaining';
  } else if (numSpots === 1){
    return '1 spot remaining';
  } else {
    return `${numSpots} spots remaining`;
  }

}


export default function DayListItem(props) {
  const dayClass = classNames({
    'day-list__item': true,
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots > 0 ? false : true
  });

  return (
    <li className={dayClass} data-testid="day" onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{ formatSpots(props.spots) }</h3>
    </li>
  );
}