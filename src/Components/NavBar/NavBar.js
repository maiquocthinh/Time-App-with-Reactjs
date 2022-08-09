import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx';
import style from './NavBar.module.css';


const navbar = [
    {
        title: 'Clock',
        link: '/clock'
    },
    {
        title: 'CountDown',
        link: '/count-down'
    },
    {
        title: 'StopWatch',
        link: '/stop-watch'
    }
];

function NavBar() {
    const location = useLocation(); // location.pathname is current path

    const [activeItem, setActiveItem] = useState(0);

    return (
        <nav className={clsx(style.Navbar)}>
            <ul className={clsx(style.NavbarList)}>
                {navbar.map((nav, index) => (
                    <li
                        key={index}
                        className={clsx(style.NavbarItem, {
                            // [style.NavbarItemActive]: index === activeItem,
                            [style.NavbarItemActive]: location.pathname === nav.link,
                        })}
                    >
                        <Link
                            className={clsx(style.NavbarLink)}
                            onClick={() => setActiveItem(index)}
                            to={nav.link}
                        >
                            {nav.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default NavBar;