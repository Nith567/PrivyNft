/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import axios from 'axios'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { fetchKeyDetails } from '../../../utils/route';
import { neynar } from 'frog/hubs'
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit'

import { erc20Abi, parseUnits } from 'viem';
const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  verify:'silent',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY as string}),
})
const usdcContractAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; 
// Uncomment to use Edge Runtime
// export const runtime = 'edge'


async function urlToBase64(imageUrl:string) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const mimeType = response.headers['content-type'];
    // return `data:${mimeType};base64,${base64}`;
    return {mimeType,base64}
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

app.frame('/owl/:id', async (c) => {
  const id = c.req.param('id');
  const { imageUrl,walletAddress,price }=await fetchKeyDetails(id);
  console.log("IMG image url",imageUrl,walletAddress)
//   const body: FrameRequest = await c.req.json()
//   const { isValid, message } = await getFrameMessage(body, {
//     neynarApiKey: '3D4F2112-0E0B-4955-A49D-540975BB75B7'
//   })
// console.log('shit",',message);
// const wallets = message?.interactor.verified_accounts;
// //3D4F2112-0E0B-4955-A49D-540975BB75B7

// console.log("fucking " , wallets)
// if(isValid){
  return c.res({
    action: `/buy/${id}`,
   image:imageUrl,

    imageAspectRatio:"1:1",
    // headers:{
    //   'Content-Type': 'image/jpg'
    // },
    intents: [
      // <TextInput placeholder="($USDC | ETH)" />,
      <Button.Transaction  target={`/send-usdc/${walletAddress}/${price}`}>Mint</Button.Transaction>,
    ]
  })
// }
// else{
  // return c.res({
  //   image: `https://gateway.lighthouse.storage/ipfs/QmZ4xVStphv71Qp2Z9d7b6qwKChrrUmu5LvCwccsZJ8899`,
  //   headers:{
  //     'Content-Type': 'image/jpeg'
  //   },
  //   intents: [
  //     <Button key='pay' value='P'> pay</Button>,
  //   ]
  // })
// }
})
app.transaction('/send-usdc/:walletAddress/:price',async (c) => {
  const walletAddress = c.req.param('walletAddress');
  const price = c.req.param('price');
  const { inputText = '' } = c

  return c.contract({
    // @ts-ignore
    abi:erc20Abi,
    chainId: "eip155:8453",
    //@ts-ignore
    functionName: 'transfer',
    args: [
      // @ts-ignore
    walletAddress,
      parseUnits(price, 6)
    ],
    // @ts-ignore
    to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  })


})


  app.frame('/buy/:id', async(c) => {
    const id = c.req.param('id');
  const { apiKey,collectionAddress, chainId, imageUrl,walletAddress }=await fetchKeyDetails(id);
    const {mimeType,base64} = await urlToBase64(imageUrl);
let typeImg=mimeType.split("/")
    console.log('bongu',base64);
    // Send the base64String to your API or store it in MongoDB
    const body: FrameRequest = await c.req.json()
    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY
    })
  
  const wallets = message?.interactor.verified_accounts;

  const options = {
    method: 'POST',
    url: `https://contracts-api.owlprotocol.xyz/api/project/collection/${chainId}/${collectionAddress}/mint-batch/erc721AutoId`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': `${apiKey}`
    },
    data: {
      imageContent: base64,
      authMode: 'project',
      //@ts-ignore
      to: [wallets[0]],
      imageSuffix: typeImg[1],
    }
  };
 
if(isValid){
  const response = await axios.request(options);
  console.log(response.data);
  const tokenId = response.data.tokens[0].tokenId;
console.log("Token ID:", tokenId);
    return c.res({
      action: 'finish',
     image:`${process.env.NEXT_PUBLIC_SITE_URL}/privy.jpeg`,
      imageAspectRatio:"1:1",
      headers:{
        'Content-Type': 'image/jpeg'
      },
      intents: [
        <Button key='pay' value='P'>Sucessfully Minted TokenId:{tokenId}</Button>,
      ]
    })
  }
  else{
    return c.res({
      image: `https://gateway.lighthouse.storage/ipfs/QmZ4xVStphv71Qp2Z9d7b6qwKChrrUmu5LvCwccsZJ8899`,
      headers:{
        'Content-Type': 'image/jpeg'
      },
      intents: [
        <Button key='pay' value='P'>Retry</Button>,
      ]
    })
  }
  })

app.frame('/finish',async (c) => {
    return c.res({
      image: `https://gateway.lighthouse.storage/ipfs/QmZ4xVStphv71Qp2Z9d7b6qwKChrrUmu5LvCwccsZJ8899`,
      headers:{
        'Content-Type': 'image/jpeg'
      },
      intents: [
        <Button key='pay' value='P'>Sucessfully purchased</Button>,
      ]
    })
  })


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
