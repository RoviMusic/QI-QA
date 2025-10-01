//File that serves as a constant for using FontAwesome icons
//you can add styles as props
//to use it just send the icon name, example: Folder
import {
  faArrowRightFromBracket,
  faBars,
  faCartShopping,
  faChartSimple,
  faChevronLeft,
  faCircleInfo,
  faCircleQuestion,
  faCode,
  faEye,
  faFileLines,
  faFilter,
  faFolder,
  faGauge,
  faGear,
  faGears,
  faListOl,
  faMinus,
  faPen,
  faPeopleArrows,
  faPlus,
  faRotate,
  faScrewdriverWrench,
  faShop,
  faStore,
  faTags,
  faToolbox,
  faTrash,
  faTriangleExclamation,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { JSX } from "react";

export const iconComponents: Record<string, (props?: any) => JSX.Element> = {
  Default: (props: any) => (
    <FontAwesomeIcon icon={faCircleQuestion} {...props} />
  ),
  Gauge: (props: any) => <FontAwesomeIcon icon={faGauge} {...props} />,
  Folder: (props: any) => <FontAwesomeIcon icon={faFolder} {...props} />,
  ListOl: (props: any) => <FontAwesomeIcon icon={faListOl} {...props} />,
  Store: (props: any) => <FontAwesomeIcon icon={faStore} {...props} />,
  "Screwdriver-Wrench": (props: any) => (
    <FontAwesomeIcon icon={faScrewdriverWrench} {...props} />
  ),
  "People-Arrows": (props: any) => (
    <FontAwesomeIcon icon={faPeopleArrows} {...props} />
  ),
  Toolbox: (props: any) => <FontAwesomeIcon icon={faToolbox} {...props} />,
  Tags: (props: any) => <FontAwesomeIcon icon={faTags} {...props} />,
  ChartSimple: (props: any) => (
    <FontAwesomeIcon icon={faChartSimple} {...props} />
  ),
  Plus: (props: any) => <FontAwesomeIcon icon={faPlus} {...props} />,
  Minus: (props: any) => <FontAwesomeIcon icon={faMinus} {...props} />,
  Cart: (props: any) => <FontAwesomeIcon icon={faCartShopping} {...props} />,
  Truck: (props: any) => <FontAwesomeIcon icon={faTruck} {...props} />,
  Bars: (props: any) => <FontAwesomeIcon icon={faBars} {...props} />,
  Rotate: (props: any) => <FontAwesomeIcon icon={faRotate} {...props} />,
  Gear: (props: any) => <FontAwesomeIcon icon={faGear} {...props} />,
  Pen: (props: any) => <FontAwesomeIcon icon={faPen} {...props} />,
  Trash: (props: any) => <FontAwesomeIcon icon={faTrash} {...props} />,
  Left: (props: any) => <FontAwesomeIcon icon={faChevronLeft} {...props} />,
  Code: (props: any) => <FontAwesomeIcon icon={faCode} {...props} />,
  "Circle-Info": (props: any) => (
    <FontAwesomeIcon icon={faCircleInfo} {...props} />
  ),
  Eye: (props: any) => <FontAwesomeIcon icon={faEye} {...props} />,
  "Triangle-Exclamation": (props: any) => (
    <FontAwesomeIcon icon={faTriangleExclamation} {...props} />
  ),
  Logout: (props: any) => (
    <FontAwesomeIcon icon={faArrowRightFromBracket} {...props} />
  ),
  Filter: (props: any) => <FontAwesomeIcon icon={faFilter} {...props} />,
  "File-Lines": (props: any) => (
    <FontAwesomeIcon icon={faFileLines} {...props} />
  ),
  Shop: (props: any) => <FontAwesomeIcon icon={faShop} {...props} />,
};
