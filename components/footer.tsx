
import React from 'react';
import Link from "next/link";
import {
  FaGithubSquare,
} from 'react-icons/fa';

const Footers = () => {
  return (
    <div className='max-w-[1240px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-gray-300'>
      <div>
        <h1 className='w-full text-3xl font-bold text-[#00df9a]'>Privy Auth</h1>
        <p className='py-4'>

        The PrivyOwl abstracts away the complexities of blockchain complexities, making it accessible(NFT's) and easy to integrate into various applications

        </p>
        <div className='flex justify-between md:w-[75%] my-6'>

        <Link href="https://github.com/Nith567/PrivyOwl" className="-m-5.5 p-1.5">
            <FaGithubSquare size={30} />
            </Link>
        </div>
      </div>
      <div className='lg:col-span-2 flex justify-end mt-6'>
    <div>
        <h6 className='font-bold text-gray-400 '>Overview</h6>
        <ul>
        <Link href="https://docs.privy.io/guide/react/quickstart"> 
            <li className='py-2 text-sm'>Privy Docs</li>
            </Link>
        <Link href="https://dashboard.privy.io"> 
            <li className='py-2 text-sm'>Privy Dashboard</li>
            </Link>
            <Link href="https://dashboard.owlprotocol.xyz/"> 
            <li className='py-2 text-sm'>Owl Dashboard</li>
            </Link>
            <Link href="https://docs.owl.build/"> 
            <li className='py-2 text-sm'>Owl Docs</li>
            </Link>
        </ul>
    </div>
      </div>
    </div>
  );
};

export default Footers;