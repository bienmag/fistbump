import React, { useEffect } from 'react'
import { z } from 'zod'



const ErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
});

type ErrorData = z.infer<typeof ErrorSchema>

interface ErrorHandlerProps {
  error: ErrorData
}
interface ErrorHandlerProps {
  error: ErrorData
  onClose: () => void
}


const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, onClose }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => {
      clearTimeout(timer)
    };
  }, [onClose])
  return (
    <div className="error-container bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <h2 className="error-title font-bold text-xl mb-2">Error</h2>
      <div className="error-details">
        <p className="error-code">Code: {error.code}</p>
        <p className="error-message">Message: {error.message}</p>
      </div>
    </div>
  )
}

export default ErrorHandler
