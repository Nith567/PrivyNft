import React from 'react'
import CTA from "@/components/CTA";

interface Props {
  id: string
}

function page({ params }: { params: { id: string } }) {
  const id = params.id
  return (
    <div>
        <CTA id={id} />
    </div>
  )
}

export default page