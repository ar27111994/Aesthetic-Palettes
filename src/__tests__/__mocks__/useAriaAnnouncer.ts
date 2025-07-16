// Mock implementation of useAriaAnnouncer
const useAriaAnnouncer = () => {
  return (message: string) => {
    console.log(`[AriaAnnouncer]: ${message}`);
  };
};

export default useAriaAnnouncer;