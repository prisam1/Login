import { useEffect, useState } from "react";

export const useDebounce = (value, delay = 500) => {
const [debouncedValue, setDebouncedValue] = useState(value);

useEffect(() => {
const handler = setTimeout(() => setDebouncedValue(value), delay);

return () => clearTimeout(handler); // cleanup
}, [value, delay]);

return debouncedValue;
};