import Image from 'next/image';

const Card = ({ komik, onClick }) => (
  <div
    key={komik.link} // Use link as key since judul might not be unique.
    className="bg-gray-700 p-1 rounded-lg flex flex-col items-center justify-center cursor-pointer"
    onClick={() => onClick(komik.link)}
  >
    <Image
      src={komik.thumbnail}
      alt={komik.judul}
      width={200}
      height={250}
      loading="lazy"
      className="w-full aspect-[3/4] bg-gray-600 rounded-lg mb-3 object-cover"
    />
    <h3 className="text-sm font-extrabold text-center line-clamp-2 ">{komik.judul}</h3>
  </div>
);

export default Card;