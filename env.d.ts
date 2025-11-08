export {};

declare global {
  interface Window {
    THREE_APP?: {
      scene?: THREE.Scene;
      camera?: THREE.PerspectiveCamera;
      renderer?: THREE.WebGLRenderer;
      controls?: any;
      piso2?: THREE.Object3D;
    };
  }
}
