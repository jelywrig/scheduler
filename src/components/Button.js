import React from "react";

import "components/Button.scss";
import classnames from "classnames";

export default function Button(props) {
   let classNm = "button";
   if(props.danger) {
      classNm += " button--danger";
   } else if (props.confirm) {
      classNm += " button--confirm";
   }

   return <button disabled={props.disabled} onClick={ props.onClick } className={ classNm } >{ props.children }</button>;
}
