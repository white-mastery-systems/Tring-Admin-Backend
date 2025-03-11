import { ref, onMounted } from 'vue'

export function useOtpInput(length = 4) {
  const otpDigits = ref<string[]>(Array(length).fill(''))
  const inputRefs = ref<(HTMLInputElement | null)[]>([])

  const handleInput = (event: Event, index: number) => {
    const input = event.target as HTMLInputElement
    const value = input.value.replace(/[^0-9]/g, '')
    otpDigits.value[index] = value

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.value[index + 1]?.focus()
    }
  }

  const handleKeydown = (event: KeyboardEvent, index: number) => {
    if (event.key === 'Backspace') {
      if (!otpDigits.value[index] && index > 0) {
        // Move to previous input on backspace if current input is empty
        inputRefs.value[index - 1]?.focus()
        otpDigits.value[index - 1] = ''
      } else {
        otpDigits.value[index] = ''
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.value[index - 1]?.focus()
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      inputRefs.value[index + 1]?.focus()
    }
  }

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault()
    const pastedData = event.clipboardData?.getData('text')
    if (!pastedData) return

    const numbers = pastedData.replace(/[^0-9]/g, '').split('').slice(0, length)
    otpDigits.value = [...numbers, ...Array(length - numbers.length).fill('')]

    // Focus last input or first empty input
    const lastFilledIndex = otpDigits.value.findLastIndex(digit => digit !== '')
    if (lastFilledIndex < length - 1) {
      inputRefs.value[lastFilledIndex + 1]?.focus()
    }
  }

  return {
    otpDigits,
    inputRefs,
    handleInput,
    handleKeydown,
    handlePaste
  }
}
