import React from "react";
import { Input } from "@/components/ui/input";
const InputWithIcon = ({ icon, ...props }) => {
  return (
    <div className="relative w-full box-border">
      <div className="absolute inset-y-0 left-0 flex items-center ">{icon}</div>
      <Input
        className="box-border pl-6 focus-visible:outline-none focus-visible:ring-0"
        {...props}
      />
    </div>
  );
};

export default InputWithIcon;
