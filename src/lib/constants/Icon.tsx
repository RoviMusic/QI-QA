//File that serves as a constant for using FontAwesome icons
//you can add styles as props
//to use it just send the icon name, example: Folder
import { faCartShopping, faChartSimple, faCircleQuestion, faFolder, faGauge, faListOl, faMinus, faPeopleArrows, faPlus, faScrewdriverWrench, faStore, faTags, faToolbox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { JSX } from "react";

export const iconComponents: Record<string, (props?: any) => JSX.Element> = {
    'Default': (props: any) => <FontAwesomeIcon icon={faCircleQuestion} {...props}/>,
    'Gauge': (props: any) => <FontAwesomeIcon icon={faGauge} {...props}/>,
    'Folder': (props: any) => <FontAwesomeIcon icon={faFolder} {...props}/>,
    'ListOl': (props: any) => <FontAwesomeIcon icon={faListOl} {...props}/>,
    'Store': (props: any) => <FontAwesomeIcon icon={faStore} {...props}/>,
    'Screwdriver-Wrench': (props: any) => <FontAwesomeIcon icon={faScrewdriverWrench} {...props}/>,
    'People-Arrows': (props: any) => <FontAwesomeIcon icon={faPeopleArrows} {...props}/>,
    'Toolbox': (props: any) => <FontAwesomeIcon icon={faToolbox} {...props}/>,
    'Tags': (props: any) => <FontAwesomeIcon icon={faTags} {...props}/>,
    'ChartSimple': (props: any) => <FontAwesomeIcon icon={faChartSimple} {...props}/>,
    'Plus': (props: any) => <FontAwesomeIcon icon={faPlus} {...props}/>,
    'Minus': (props: any) => <FontAwesomeIcon icon={faMinus} {...props}/>,
    'Cart': (props: any) => <FontAwesomeIcon icon={faCartShopping} {...props}/>
} 