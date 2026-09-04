import { FC } from "react";
interface PicUploadsProps {
  src: string;
  onClick: () => void;
}

const PicUploads: FC<PicUploadsProps> = ({ src, onClick }) => {
  return (
    <div
      className="!w-20 !h-20 bg-card border border-border rounded-xl cursor-pointer hover:scale-105 transition-all overflow-hidden flex-shrink-0"
      onClick={onClick}
    >
      <img
        src={src}
        alt="Upload Image"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default PicUploads;
