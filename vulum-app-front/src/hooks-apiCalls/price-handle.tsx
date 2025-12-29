import { useState, ChangeEvent, FocusEvent } from "react"

export function usePriceInput(initialValue: string = "") {
  const [price, setPrice] = useState<string>(initialValue)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value)
    }
  }

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (price === "") return
    const formatted = parseFloat(price).toFixed(2)
    setPrice(formatted)
  }

  return { price, onChange, onBlur }
}
