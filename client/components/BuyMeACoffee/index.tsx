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
          height="60px"
          width="217px"
        />
      </a>
    </div>
  );
};

export default index;
