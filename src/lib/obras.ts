/**
 * Versión de las fotos de /obras. Las imágenes se cachean por URL (navegador y
 * optimizador de Next), así que al reemplazar una foto con el mismo nombre se
 * seguiría viendo la anterior: subí este número cada vez que cambies fotos.
 */
export const OBRAS_VERSION = "2";

/** Ruta versionada de una foto de /obras. */
export const obra = (path: string): string => `${path}?v=${OBRAS_VERSION}`;
