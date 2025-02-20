import { FC, ReactNode } from 'react';

interface ChartsContainerProps {
  children: ReactNode;
}

const ChartsContainer: FC<ChartsContainerProps> = ({ children }) => {
  return (
    <div className="mx-auto flex w-full flex-wrap justify-center gap-5 p-4">
      {children}
    </div>
  );
};

export default ChartsContainer;