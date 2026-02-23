import { FaArrowLeft } from "react-icons/fa";
import Button from "../../kit/Button";
import { useNavigate } from "react-router-dom";

const NavigateButton = () => {
  const navigate = useNavigate();

  const onclick = () => navigate(-1);

  return (
    <Button
      className="p-0 h-7 bg-transparent text-xl font-semibold text-slate-800 mb-3"
      size="sm"
      variant="plain"
      icon={<FaArrowLeft />}
      onClick={onclick}
      type="button"
    >
      Товары
    </Button>
  );
};

export default NavigateButton;
