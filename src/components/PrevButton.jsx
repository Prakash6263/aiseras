import { useNavigate } from "react-router-dom"
import { FaCircleArrowLeft } from "react-icons/fa6"

export default function PrevButton({ className = "" }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`btn btn-link p-0 border-0 bg-transparent d-flex align-items-center ${className}`}
      aria-label="Go Back"
    >
      <FaCircleArrowLeft className="text-white fs-3" />
    </button>
  )
}
