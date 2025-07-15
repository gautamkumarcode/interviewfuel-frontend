import { useEffect, useState } from "react";

function useWindowDimensions() {
	const [dimensions, setDimensions] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		// Check if window is available (ensures this runs only on the client side)
		if (typeof window !== "undefined") {
			const handleResize = () => {
				setDimensions({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			};

			// Set initial dimensions
			handleResize();

			// Add event listener
			window.addEventListener("resize", handleResize);

			// Cleanup event listener on component unmount
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	return dimensions;
}

export default useWindowDimensions;
