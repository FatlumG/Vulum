import React from 'react'
import PricingCard from './PricingCard'

const PricingCards: React.FC = () => {
  return (
    <div className='w-full h-full flex justify-center items-center gap-10'>
        <PricingCard/>
        <PricingCard/>
        <PricingCard/>
    </div>
  )
}

export default PricingCards