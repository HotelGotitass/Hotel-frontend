import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router no hace scroll a anclas (/#experiencia) ni vuelve arriba al cambiar de pagina
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
