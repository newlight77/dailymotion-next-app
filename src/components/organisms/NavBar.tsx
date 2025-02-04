"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { FaTimes, FaBars } from 'react-icons/fa';
import donghua from '../../../public/donghua.png';


const links = [
  { id: 1, route: "/", label: 'home' },
  { id: 2, route: '/animelist', label: "anime list" },
  { id: 3, route: '/schedule', label: "schedule" },
  { id: 4, route: '/history', label: "history" },
  { id: 5, route: '/favorites', label: "favorites" },
  { id: 6, route: '/followings', label: "followings" },
];


const NavBar: React.FC = () => {
  const [nav, setNav] = useState(false);

  function toggleShowNav(): void {
    setNav(!nav);
}

  return (
    <div className="flex py-2 relative z-100">

      <div className="cursor-pointer pl-3 pt-3 z-10 text-gray-500" >
        {nav ?
          <FaTimes size={36} className="" onClick={toggleShowNav}/>
          :
          <FaBars size={36} className="md:hidden" onClick={toggleShowNav}/>}
      </div>

      <Link href={'/'} className="ml-2 px-2 flex">
        <img className='p-1' style={{ objectFit: 'scale-down', width: 60, height: 60 }} src={donghua.src} alt="donghua" />
        <div className='py-2 pl-4 pr-1 underline underline-offset-4 font-bold text-3xl '>donghua</div>
        {/* <div className='py-2 px-1 underline underline-offset-4 font-bold text-3xl '>animation</div> */}
      </Link>

      <div className='pl-8 justify-between items-center'>

        <ul className="hidden md:flex pt-4">
          {links.map(({ id, label, route }) => (
            <li key={id} className="nav-links px-4 cursor-pointer capitalize font-medium text-gray-500 hover:scale-105 hover:text-white duration-200 link-underline" >
              <Link className='text-xl' href={route}>{label}</Link>
            </li>
          ))}
        </ul>

        <div className='sm:show'>
          {nav && (
            <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-secondary to-secondary text-primary" >
              {links.map(({ id, label, route }) => (
                <li key={id} className="px-4 cursor-pointer capitalize py-6 text-4xl" >
                  <Link href={route} onClick={toggleShowNav} >{label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>


    </div>
  );
};


export default NavBar;
