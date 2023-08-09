import React from 'react';
import { classNames } from 'primereact/utils';
import { useState } from 'react';
import 'primereact/resources/primereact.min.css'; // Estilos de PrimeReact
import 'primeicons/primeicons.css'; // Estilos de PrimeIcons
import 'primeflex/primeflex.css';
const AppMenu = ({ model, onMenuItemClick, searchTerm }) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);

  const isSubMenuActive = (index) => {
    return activeMenuIndex === index;
  };

  const onSubMenuClick = (index) => {
    setActiveMenuIndex((prevActiveIndex) => (prevActiveIndex === index ? null : index));
  };

  const renderMenuItem = (item, index, isMainItem) => {
    const isActive = isSubMenuActive(index);
    const filteredSubItems = item.items.filter(subItem =>
      subItem.label.toLowerCase().includes(searchTerm.toLowerCase()) // Utiliza props.searchTerm en lugar de searchTerm
  );

  // Renderizar solo si hay elementos que coincidan con la búsqueda
  if (filteredSubItems.length === 0) {
      return null;
  }


    return (
      <li key={item.label || index} className={classNames({ 'active-menuitem': isActive, 'main-menuitem': isMainItem })}>
        <a onClick={() => onSubMenuClick(index)}>
          <i className={classNames('layout-menuitem-icon', item.icon)}></i>
          <span className="layout-menuitem-text">{item.label}</span>
          {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
        </a>
        {item.items && isActive && (
          <ul className={classNames({ 'layout-submenu': true })}>
            {item.items.map((subItem, subIndex) => (
              <li key={subItem.label || subIndex} className={classNames({ 'active-menuitem': subItem.active })}>
                <a onClick={(e) => onMenuItemClick(e, subItem)}>
                <i className={classNames('layout-menuitem-icon', subItem.icon)}></i>
                  <span className="layout-menuitem-text">{subItem.label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return <ul className="layout-menu">{model.map((item, index) => renderMenuItem(item, index, true))}</ul>;
};

export default AppMenu;
