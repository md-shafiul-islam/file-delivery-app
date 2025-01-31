import React from "react";
import { Input } from "@/components/ui/input";
const InputWithIcon = ({ icon, ...props }) => {
  return (
    <div className="relative w-full box-border">
      {icon && (
        <div className="absolute inset-y-0 left-3 flex items-center">
          {icon}
        </div>
      )}

      <Input
        className="pl-10 focus-visible:ring-0 focus-visible:outline-none"
        {...props}
      />
    </div>
  );
};

export default InputWithIcon;
