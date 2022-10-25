import Image from "next/image";
import React from "react";

const index = () => {
  return (
    <div>
      <a
        href="https://www.buymeacoffee.com/gatsbybom"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          src="/images/buymeacoffee.png"
          alt="Buy Me A Coffee"
          height={60}
          width={217}
        />
      </a>
    </div>
  );
};

export default index;
