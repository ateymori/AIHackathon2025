// export {};

declare module "aos" {
  interface AOSOptions {
    // Define the options you might use here
    delay?: number;
    duration?: number;
    easing?: string;
  }

  interface AOS {
    init(options?: AOSOptions): void;
  }

  const aos: AOS;
  export default aos;
}
