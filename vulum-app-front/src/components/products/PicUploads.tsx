import { FC } from "react";

interface PicUploadsProps {
  src: string;
  onClick: () => void;
}

const PicUploads: FC<PicUploadsProps> = ({ src, onClick }) => {
  return (
    <div
      className="w-20 h-20 bg-white rounded-md cursor-pointer hover:scale-105 transition-all overflow-hidden"
      onClick={onClick}
    >
      <img src={src} alt="Upload Image" className="w-full h-full object-cover" />
    </div>
  );
};

export default PicUploads;
