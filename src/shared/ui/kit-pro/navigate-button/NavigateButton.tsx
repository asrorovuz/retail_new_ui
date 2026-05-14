import { FaArrowLeft } from "react-icons/fa";
import Button from "../../kit/Button";
import { useNavigate } from "react-router-dom";

const NavigateButton = ({
  click,
  content,
}: {
  click?: any;
  content: string;
}) => {
  const navigate = useNavigate();

  const onclick = () => (typeof click === "function" ? click() : navigate(-1));

  return (
    <Button
      className="p-0 h-7 bg-transparent text-xl font-semibold text-slate-800 uppercase"
      size="sm"
      variant="plain"
      icon={<FaArrowLeft />}
      onClick={onclick}
      type="button"
    >
      {content}
    </Button>
  );
};

export default NavigateButton;
