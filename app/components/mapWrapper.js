// components/MapWrapper.js
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./mapStatic'), {
  ssr: false,
});

export default function MapWrapperStatic(props) {
  return <MapComponent {...props} />;
}
