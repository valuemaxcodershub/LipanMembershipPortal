import { motion } from 'framer-motion';


function SpinnerLogo (){
  return (
    <div className="flex items-center justify-center relative size-28">
      {/* Inner Logo */}
      <div
        className="absolute w-full h-28 font-bold flex items-center justify-center rounded-full"
    
      >
        <img src="/icon-logo.png" alt="Logo" className='h-full'/>
      </div>
      {/* Outer Ring 1 */}
      <motion.div
        className="absolute size-24 border-[3px] border-transparent border-t-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: 'linear',
        }}
      />
      {/* Outer Ring 2 */}
      <motion.div
        className="absolute w-20 h-20 border-[3px] border-transparent border-t-blue-400 rounded-full"
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: 'linear',
        }}
      />
    </div>
  );
};

export default SpinnerLogo
