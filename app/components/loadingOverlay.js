import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animaciones
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Estilos
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  padding: 2rem;
  border-radius: 20px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: ${pulse} 2s infinite ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  position: relative;
`;
const OuterCircle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #4f02be;
  border-radius: 50%;
  animation: ${rotate} 1.5s linear infinite;
`;

const InnerCircle = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 3px solid transparent;
  border-top-color: #f76a12;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite reverse;
`;

const Dot = styled.div`
  position: absolute;
  top: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #f76a12;
  border-radius: 50%;
  transform: translateX(-50%);
  animation: ${float} 2s ease-in-out infinite;
`;

const LoadingText = styled.h3`
  margin-bottom: 15px;
  font-weight: 300;
  font-size: 1.2rem;
`;

const ProgressBar = styled.div`
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4f02be, #f76a12);
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;


const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
`;

const LoadingDot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  width: 8px;
  height: 8px;
  background: ${props => props.active ? '#ff7e5f' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 50%;
  margin: 0 4px;
  transition: background 0.3s ease;
`;

const LoadingModal = ({ 
  message = "Cargando...", 
  showProgress = true,
  imageSrc = "/logo.png",
  imageAlt = "Loading"
}) => {
  const [progress, setProgress] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 5));
      setActiveDot(prev => (prev + 1) % 3);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [showProgress]);

  return (
    <Overlay>
      <ModalContainer className='bg-white text-black dark:bg-slate-800 dark:text-white'>
        <Spinner>
          <OuterCircle />
          <InnerCircle />
          {imageSrc && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={imageSrc} 
                alt={imageAlt} 
                className="w-10 h-10 object-contain rounded-full" 
              />
            </div>
          )}
        </Spinner>
        
        <LoadingText>{message}</LoadingText>
        
        {showProgress && (
          <>
            <ProgressBar>
              <Progress progress={progress} />
            </ProgressBar>
            <DotsContainer>
              {[0, 1, 2].map(i => (
                <LoadingDot key={i} active={i === activeDot} />
              ))}
            </DotsContainer>
          </>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default LoadingModal;