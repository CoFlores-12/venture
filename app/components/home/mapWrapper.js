// components/MapWrapper.js
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./map'), {
  ssr: false,
});

export default function MapWrapper(props) {
  return <MapComponent {...props} />;
}
