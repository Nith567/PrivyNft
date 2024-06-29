'use client';
import React, { useState } from "react";
import Image from "next/image";
import { XCircleIcon } from "@heroicons/react/24/outline";
import upload from "@/utils/upload";
import {usePrivy} from '@privy-io/react-auth';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleVerify: (apiKey: string, collectionAddress: string, chainId: string, imageUrl: string, walletAddress: string, price: string) => void;
}

const StoreModal: React.FC<Props> = ({ handleVerify, setShowModal }) => {
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {ready, authenticated, login,user,logout} = usePrivy();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        //@ts-ignore
        const url = await upload(file);
        setImageDataUrl(url);
        console.log("Image URL:", url);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = () => {
    const apiKey = (document.getElementById('apiKeyInput') as HTMLInputElement)?.value;
    const collectionAddress = (document.getElementById('collectionAddressInput') as HTMLInputElement)?.value;
    const chainId = (document.getElementById('chainIdInput') as HTMLInputElement)?.value;
    const walletAddress = (document.getElementById('walletAddressInput') as HTMLInputElement)?.value;
    const price = (document.getElementById('priceInput') as HTMLInputElement)?.value;

    if (imageDataUrl) {
      //@ts-ignore
      handleVerify(apiKey, collectionAddress, chainId, imageDataUrl, user?.wallet?.address, price);
    } else {
      console.log('Image URL is not ready yet.');
    }
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 bg-green opacity-50"></div>
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full shadow-lg text-black">
        <div
          className="h-6 w-6 mt-14 absolute top-22 right-4 text-gray-500 cursor-pointer"
          onClick={() => setShowModal(false)}
        >
          <XCircleIcon className="z-50" />
        </div>
        <div className="flex flex-col items-center font-thin mb-6">
          <Image
            src="/privy.jpeg"
            alt="owl logo"
            width={100}
            height={100}
            className="w-full h-full object-contain mb-4"
          />
          <h2 className="text-2xl font-bold mb-4">Terms &amp; Conditions</h2>
          <input
            id="apiKeyInput"
            type="text"
            placeholder="Enter Your API Key"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
          />
          <input
            id="collectionAddressInput"
            type="text"
            placeholder="Enter Your Collection Address"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
          />
          <input
            id="chainIdInput"
            type="text"
            placeholder="Enter chainId"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
          <div className=" mt-1 mb-2">
          <input type="file" onChange={handleImageUpload} />
          </div>
          <input
            id="walletAddressInput"
            type="text"
            placeholder="Enter walletAddress"
            value={user?.wallet?.address}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
          <input
            id="priceInput"
            type="number"
            placeholder="Enter price"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          />
          <p className="text-lg text-left">
            By clicking the button below, you agree to the following terms:
          </p>
          <ul className="list-disc mb-6 text-lg text-left">
            <li>We don't store your API keys in any way.</li>
          </ul>
          <button
            className="bg-[#01f1c1] text-white px-6 py-3 rounded-md shadow-sm hover:bg-green-700 transition-colors duration-300"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreModal;
