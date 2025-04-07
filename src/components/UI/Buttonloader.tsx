import { AiOutlineLoading3Quarters } from "react-icons/ai";
interface PropType {
  isLoading: boolean;
  title: string;
}

function Buttonloader({ isLoading, title }: PropType) {
  return (
    <>
      {isLoading ? (
        // <AiOutlineLoading className='animate-spin h-5'/>
        <AiOutlineLoading3Quarters className="h-5 animate-spin" />
      ) : (
        <>{ title }</>
      )}
    </>
  );
}

export default Buttonloader;
