import React from "react";

export default function Sidebar({
  closeSidebar,
  switchToUpperCase,
  switchToLowerCase,
  switchToNumbers,
}) {
  return (
    <div className="sidebar">
      <i
        id="closeBtn"
        className="fas fa-window-close"
        onClick={closeSidebar}
      ></i>
      <ul>
        <div className="sidebar-align">
          <i className="fas fa-sort-alpha-up"></i>
          <li>
            <button type="button" onClick={switchToUpperCase}>
              Uppercase
            </button>
          </li>
        </div>
        <div className="sidebar-align">
          <i className="fas fa-sort-alpha-down"></i>
          <li>
            <button type="button" onClick={switchToLowerCase}>
              Lowercase
            </button>
          </li>
        </div>
        <div className="sidebar-align">
          <i className="fas fa-sort-numeric-down"></i>
          <li>
            <button type="button" onClick={switchToNumbers}>
              Numbers
            </button>
          </li>
        </div>
      </ul>
    </div>
  );
}
