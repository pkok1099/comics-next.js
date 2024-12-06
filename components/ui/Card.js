import Image from 'next/image';

const Card = ({ komik, onClick }) => (
  <div
    key={komik.link} // Use link as key since judul might not be unique.
    className='flex cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-700 p-1'
    onClick={() => onClick(komik.link)}
  >
    <Image
      src={komik.thumbnail}
      alt={komik.judul}
      width={200}
      height={250}
      loading='lazy'
      className='mb-3 aspect-[3/4] w-full rounded-lg bg-gray-700 object-cover'
    />
    <h3 className='line-clamp-2 text-center text-sm font-extrabold'>
      {komik.judul}
    </h3>
  </div>
);

export default Card;
