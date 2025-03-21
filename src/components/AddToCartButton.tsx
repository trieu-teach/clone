'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useCart, useToast } from '@/lib/custom-hooks'
import { z } from 'zod'
import { zProductSchemaUdate } from '@/schemas/productSchema'

const AddToCartButton = ({
  product,
}: {
  product: z.infer<typeof zProductSchemaUdate>
}) => {
  const { addItem } = useCart()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isSuccess])

  return (
    <Button
      onClick={() => {
        addItem(product)
        setIsSuccess(true)
        useToast("Item added to cart!")
      }}
      size='lg'
      className='w-full'>
      {isSuccess ? 'Added!' : 'Add to cart'}
    </Button>
  )
}

export default AddToCartButton
