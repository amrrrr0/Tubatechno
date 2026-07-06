import { ButtonProps } from "@/types";

const Button: React.FC<ButtonProps> = ({ styles }) => {
  return (
    <button
      type="button"
      className={`${styles} motion-button py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary-dark outline-none rounded-[10px] cursor-pointer`}
    >
      Hubungi Kami
    </button>
  );
};

export default Button;
