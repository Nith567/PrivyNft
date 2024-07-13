"use client";
import { useState, useEffect } from "react";
import { Sansita_Swashed,Petrona } from "next/font/google";
const sasita = Sansita_Swashed ({ subsets: ["latin"] });
const petrona = Petrona ({ subsets: ["latin"] });
import {useWallets} from '@privy-io/react-auth';
import {usePrivy} from '@privy-io/react-auth';
import StoreModal from "./StoreModal";
import axios from "axios";
import { useRouter } from 'next/navigation'
import Footers from "./footer";

export default function Hero() {
    const router = useRouter()
    const {ready, authenticated, login,user,logout} = usePrivy();

    const disableLogin = !ready || (ready && authenticated);
    const disablelogout = ready
    const {wallets} = useWallets();

  const [showModal, setShowModal] = useState(false); 
  const [base64, setBase64] = useState('');

  const handleImageUpload = async (event:React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // if (file) {
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         if (typeof reader.result === 'string') {
    //             setBase64(reader.result);
    //         }
    //     };
    //     reader.readAsDataURL(file);
    // }
 

    try {
      const response = await axios.get("http://res.cloudinary.com/ds2wxteop/image/upload/v1717257122/localservice/xnmfnf6bfnh28avxf7ir.jpg", {
        responseType: 'arraybuffer'
      });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const mimeType = response.headers['content-type'];
      
      console.log(`${mimeType}`,`data:${mimeType};base64,${base64}`)
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
};

const  handleVerify =async (apiKey:string, collectionAddress:string, chainId: string,imageUrl:string,walletAddress:string,price:string,gmailAddress:string) => {
try{
  const response=  await axios.post('http://localhost:4000/api/ship', {
    apiKey,
    collectionAddress,
    chainId,
    imageUrl,
    walletAddress,
    price,
    gmailAddress
  })
  const objectId = response.data._id;
  console.log('response ',response.data._id)
  router.push(`/shop/${objectId}`)
} catch (error) {
    console.error('Error verifying:', error);
  }
    setShowModal(false);
  }
  
  return (
    <div className="bg-white font-semibold">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
        <div
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:-mr-80 lg:-mr-96"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-4">
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
            Gasless NFTs Experience directly within Frames on any EVM or custom rollup using{" "}
              <span className={`${sasita.className}`}> 
              <a href="https://docs.owl.build/dashboard-docs" className="-m-1.5 p-1.5">
              Owl Privy
              </a>
              </span> {" "}
              <span className={` ${petrona.className}    text-transparent bg-clip-text bg-gradient-to-br from-slate-500 to-[#01f141] mt-2`}>
               owlPrivyFrame
              </span>
            </h1>
            <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
              <p className="text-lg leading-8 text-gray-600">
                Get a frame link from your dashboard and share it with your subscribers. They can mint your NFTs directly within Frames on any EVM or custom rollup using OwlPrivy.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <button onClick={() => setShowModal(true)}
                  className="rounded-md shad bg-[#01f121] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </button>
                {ready && !authenticated && (
      <button className='m-2 p-3 bg-blue-500 inline-block  hover:bg-violet-800 text-white font-bold py-2 px-4 rounded-lg shadow-md'disabled={disableLogin} onClick={login}>
      Log in
    </button>
                )}
                {ready && authenticated && (
      <button className='m-2 p-3 bg-blue-500 inline-block  hover:bg-violet-800 text-white font-bold py-2 px-4 rounded-lg shadow-md'disabled={disableLogin} onClick={login}>
     {user?.wallet?.address}
    </button>
                )}
                

                <div>
                  
                </div>
                <div>
    
                  {base64 && (
                    <div className="text-green bg-green-600">
                      <h3>Base64 String: sul</h3>
                      <textarea
                        readOnly
                        value={base64}
                        rows={10}
                        cols={50}
                      />
                    </div>
                  )}
                </div>
              </div>
              {showModal && <StoreModal setShowModal={setShowModal} handleVerify={handleVerify}  />}
            </div>
            <img
              src="/privy.jpeg"
              alt="privy-owl"
              className="mt-7 w-full lg:w-full md:w-fit sm:h-70 md:h-100 max-w-lg rounded-md object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-24"
            />
          </div>
        </div>
      </div>
      <Footers/>
    </div>
  );
}