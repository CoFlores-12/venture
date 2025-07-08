"use client";
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import QrScanner from 'qr-scanner';
import CryptoJS from 'crypto-js';


export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const verifyToken = async (token) => {
    try {
        const bytes = CryptoJS.AES.decrypt(token, "QRCODE");
      const isValid = bytes.toString(CryptoJS.enc.Utf8);
      const data = JSON.parse(isValid);
      
      if (isValid) {
        return {
          status: 'success',
          token: token,
          data: {
            id: data.id,
            boletos: data.boletos,
            message: 'Token válido',
            user: 'usuario_ejemplo',
            expiresAt: new Date(Date.now() + 86400000).toISOString()
          }
        };
      } else {
        throw new Error('Token inválido');
      }
    } catch (err) {
      console.error('Error al verificar token:', err);
      throw err;
    }
  };

  const startScanner = () => {
  if (videoRef.current && !isScanning) {
    setIsScanning(true);
    setError(null);
    
    qrScannerRef.current = new QrScanner(
      videoRef.current,
      async (result) => {
        try {
          // Verificar el token (esperar a que se resuelva la Promise)
          const verification = await verifyToken(result.data);
          setScanResult(verification);
          setIsModalOpen(true);
          stopScanner();
        } catch (err) {
          console.error("Error procesando QR:", err);
          setError('Error al procesar el QR: ' + err.message);
          stopScanner();
        }
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 5,
      }
    );
    
    qrScannerRef.current.start()
      .catch(err => {
        console.error("Error cámara:", err);
        setError('Error al acceder a la cámara: ' + err.message);
        setIsScanning(false);
      });
  }
};

  // Detener el escáner
  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    startScanner();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Escáner QR con Token | Next.js</title>
        <meta name="description" content="Escanea códigos QR con tokens y muestra la información" />
      </Head>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Escáner QR con Token</h1>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="relative aspect-square mb-6 border-2 border-gray-300 rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
              />
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <p className="text-white">Cámara inactiva</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              {!isScanning ? (
                <button
                  onClick={startScanner}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Iniciar Escaneo
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Detener Escaneo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

{isModalOpen && (
<div
        contentLabel="Información del Token"
        className="modalc z-30"
        overlayClassName="overlay"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Información del Token</h2>

          {
            scanResult && (
                <>
                    <div className="mb-4">
                        <h3 className="font-medium text-gray-700">Token escaneado:</h3>
                        <p className="mt-1 p-2 bg-gray-100 rounded-md break-all">{scanResult.token}</p>
                    </div>
                    
                    <div className="mb-4">
                        <h3 className="font-medium text-gray-700">id escaneado:</h3>
                        <p className="mt-1 p-2 bg-gray-100 rounded-md break-all">{scanResult.data.id}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-medium text-gray-700">usuario:</h3>
                        <p className="mt-1 p-2 bg-gray-100 rounded-md break-all">{scanResult.data.user}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-medium text-gray-700">Boletos:</h3>
                        <p className="mt-1 p-2 bg-gray-100 rounded-md break-all">{scanResult.data.boletos}</p>
                    </div>
                </>
            )
          }
          
         
          
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
)}
      

      <style jsx global>{`
        .modalc {
          position: fixed;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          transform: translate(-50%, -50%);
          background: white;
          padding: 0;
          border-radius: 0.5rem;
          max-width: 90%;
          width: 500px;
          height: 95vh;
          overflow: auto;
          outline: none;
        }
        
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
}