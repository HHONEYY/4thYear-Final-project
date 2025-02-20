import { FC, ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

const ChartCard: FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="group relative flex h-[400px] w-[450px] flex-col items-center overflow-hidden rounded-xl bg-white p-5 pt-12 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg animate-fadeIn md:w-full lg:w-[450px]">
      <h3 className="absolute left-1/2 top-3 z-10 w-full -translate-x-1/2 text-center text-lg font-bold">
        {title}
      </h3>
      <div className="flex h-full w-full items-center justify-center">
        <div className="mt-8 flex h-[90%] w-[90%] items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;