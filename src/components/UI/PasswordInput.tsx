import { forwardRef, useState } from "react";
import { HiEye, HiEyeOff, HiLockClosed } from "react-icons/hi";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: any;
  label?: string;
}
type InputRef = HTMLInputElement | null;
import { Label, TextInput, Tooltip } from "flowbite-react";

const PasswordInput = forwardRef<InputRef, PasswordInputProps>(
  ({ error, label, placeholder="********", ...otherProps }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };
    const passwordInputType = showPassword ? "text" : "password";
    return (
      <div>
        {label && <Label htmlFor={label} value={label} />}
        <div className="relative">
          <TextInput
            id={label}
            type={passwordInputType}
            icon={HiLockClosed}
            placeholder={placeholder}
            {...otherProps}
            ref={ref}
            color={error ? "failure" : "gray"}
          />
          <div className={`absolute right-3 top-3 flex items-center`}>
            <Tooltip
              className="!text-sm"
              content={showPassword ? "Hide" : "Show"}
              animation="duration-500"
            >
              <button
                type="button"
                className="text-gray-500 dark:text-gray-300 text-lg"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </Tooltip>
          </div>
        </div>
        {error && <span className="text-red-600 text-sm">{error.message}</span>}
      </div>
    );
  }
);

export default PasswordInput;
PasswordInput.displayName = "PasswordInput";
